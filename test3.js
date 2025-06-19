const crypto = require("crypto");
const querystring = require("querystring");

const AES_ALGO = "aes-256-cbc";
const SECRET_KEY = "14ebbe42dc66271a";
const IV = Buffer.alloc(16); // Zeroed IV

function getKeyFromPassword(password, salt) {
  return crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, "utf8"),
    65536,
    32,
    "sha256",
  );
}

function base64UrlEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function encryptAES(payload, salt) {
  const key = getKeyFromPassword(SECRET_KEY, salt);
  const cipher = crypto.createCipheriv(AES_ALGO, key, IV);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(payload, "utf8")),
    cipher.final(),
  ]);
  return base64UrlEncode(encrypted);
}

function xor(a, key) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] ^ key[i % key.length];
  }
  return out;
}

function encryptValueToXor(value, key) {
  return Buffer.from(xor(Buffer.from(value), Buffer.from(key))).toString(
    "base64",
  );
}

function decryptXoredValue(xoredValue, key) {
  const decoded = Buffer.from(xoredValue, "base64");
  return xor(decoded, Buffer.from(key)).toString("utf8");
}

function generateReqDateSalt() {
  const now = new Date();
  const pad = (num, size = 2) => num.toString().padStart(size, "0");
  return [
    pad(now.getUTCDate()),
    pad(now.getUTCMonth() + 1),
    now.getUTCFullYear(),
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
    Math.floor(now.getUTCMilliseconds() / 100).toString(),
  ].join("");
}

function buildRedirectURL(baseURL, params) {
  const salt = generateReqDateSalt();

  const fields = {
    redirect: params.redirect,
    sessionid: params.sessionid,
    srcref: params.srcref,
    txnid: params.txnid,
    userid: params.userid,
  };

  const sorted = Object.keys(fields)
    .sort()
    .reduce((acc, key) => {
      acc[key] = fields[key];
      return acc;
    }, {});

  console.log(salt);

  const body = querystring.stringify(sorted);

  const ecreq = encryptAES(body, salt);
  const xorFI = encryptValueToXor(params.fi, salt);

  console.log(ecreq);

  console.log(xorFI);

  const url = new URL(baseURL);
  url.searchParams.set("reqdate", salt);
  url.searchParams.set("ecreq", ecreq);
  url.searchParams.set("fi", xorFI);

  return url.toString();
}

// ✅ Example usage:
const redirectURL = buildRedirectURL("https://aa-uat.onemoney.in", {
  txnid: "b1cf3a51-3803-42fc-9eae-ed403e75eb7d",
  sessionid: "f7ab9537-5fc0-4cdb-b5d0-d2d613738dec",
  srcref: ["476c7249-57c3-46d6-a4d9-282f550d5805"],
  userid: "8655608901@onemoney",
  redirect: "https://example.com",
  fi: "KMBL-FIU-D",
});

console.log("Redirect URL:", redirectURL);
