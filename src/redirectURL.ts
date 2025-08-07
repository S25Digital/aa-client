import crypto, { BinaryLike, CipherKey } from "crypto";
import querystring from "querystring";

const AES_ALGO = "aes-256-cbc";
const IV = Buffer.alloc(16); // Zeroed IV

function getKeyFromPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, "utf8") as BinaryLike,
    65536,
    32,
    "sha256"
  );
}

function base64UrlEncode(buffer: Buffer) {
  let str = buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

    while (str.length % 4) {
      str += "=";
    }

    return str;
}

function base64UrlDecode(str: string) {
  // Revert URL encoding
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with '=' to make length a multiple of 4
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

function encryptAES(payload: string, salt: string, secret: string) {
  const key = getKeyFromPassword(secret, salt);
  const cipher = crypto.createCipheriv(
    AES_ALGO,
    key as CipherKey,
    IV as BinaryLike
  );
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(payload, "utf8") as any)as any,
    cipher.final()
  ]);
  return base64UrlEncode(encrypted);
}

// If you need to decrypt, use this
function decryptAES(cipherText: string, salt: string, secret: string) {
  const key = getKeyFromPassword(secret, salt);
  const decipher = crypto.createDecipheriv(
    AES_ALGO,
    key as CipherKey,
    IV as BinaryLike
  );
  const encryptedBuffer = base64UrlDecode(cipherText);
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer as any) as any,
    decipher.final() as any
  ]);
  return decrypted.toString("utf8");
}

function xor(a: Buffer, key: Buffer) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] ^ key[i % key.length];
  }
  return out;
}

function encryptValueToXor(value: string, key: string) {
  // Explicitly use UTF-8 encoding!
  const valueBuf = Buffer.from(value, "utf8");
  const keyBuf = Buffer.from(key, "utf8");
  return xor(valueBuf, keyBuf).toString("base64");
}

function decryptXoredValue(xoredValue: string, key: string) {
  const decoded = Buffer.from(xoredValue, "base64");
  const keyBuf = Buffer.from(key, "utf8");
  return xor(decoded, keyBuf).toString("utf8");
}

function generateReqDateSalt() {
  const now = new Date();
  const pad = (num: number, size = 2) => num.toString().padStart(size, "0");
  return [
    pad(now.getUTCDate()),
    pad(now.getUTCMonth() + 1),
    now.getUTCFullYear(),
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
    Math.floor(now.getUTCMilliseconds() / 100).toString()
  ].join("");
}

export function buildRedirectURL(
  baseURL: string,
  params: {
    txnid: string;
    sessionid: string;
    srcref: string[];
    userid: string;
    redirect: string;
    fi: string;
    secret: string;
    pan?: string;
    dob?: string;
    email?: string;
    fipid?: string[];
  }
) {
  const salt = generateReqDateSalt();

  const fields: Record<string, any> = {
    redirect: params.redirect ?? "",
    sessionid: params.sessionid,
    srcref: params.srcref,
    txnid: params.txnid,
    userid: params.userid,
    pan: params.pan ?? null,
    dob: params.dob ?? null,
    fipid: params.fipid ?? [],
    email: params.email ?? null
  };

  const sorted = Object.keys(fields)
    .sort()
    .reduce((acc, key) => {
      acc[key] = fields[key];
      return acc;
    }, {} as Record<string, any>);

  const body = querystring.stringify(sorted, null, null, {
    encodeURIComponent: (data) => data
  });

  const ecreq = encryptAES(body, salt, params.secret);
  const xorFI = encryptValueToXor(params.fi, salt);

  const url = new URL(baseURL);
  url.searchParams.set("reqdate", salt);
  url.searchParams.set("ecreq", ecreq);
  url.searchParams.set("fi", xorFI);

  // Uncomment for debugging
  // console.log({ salt, body, ecreq, xorFI, url: url.toString() });

  return {
    url: url.toString(),
    reqdate: salt,
    ecreq,
    fi: xorFI
  };
}
