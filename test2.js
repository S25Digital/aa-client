const crypto = require("crypto");
const querystring = require("querystring");

const AES_ALGO = "aes-256-cbc";
const SECRET_KEY = "ac12ghd75kf75r";
const IV = Buffer.alloc(16); // Zeroed IV as per spec

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
  return base64UrlEncode(encrypted); // 🔁 no encodeURIComponent
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

  const body = querystring.stringify({
    txnid: params.txnid,
    sessionid: params.sessionid,
    srcref: params.srcref,
    userid: params.userid,
    redirect: params.redirect,
  });

  console.log(salt);

  const ecreq = encryptAES(body, salt);
  const xorFI = encryptValueToXor(params.fi, salt);

  console.log(ecreq);

  const url = new URL(baseURL);
  url.searchParams.set("reqdate", salt);
  url.searchParams.set("ecreq", ecreq);
  url.searchParams.set("fi", xorFI);

  console.log("Salt:", salt);
  console.log("Payload (form body):", body);
  console.log("Encrypted ecreq:", ecreq);
  console.log("XOR FI:", xorFI);
  console.log("Redirect URL:", url.toString());

  return url.toString();
}

// Example usage:
const redirectURL = buildRedirectURL("https://app-uat.onemoney.in", {
  txnid: "b1cf3a51-3803-42fc-9eae-ed403e75eb7d",
  sessionid: "b1cf3a51-3803-42fc-9eae-ed403e75eb7d",
  srcref: ["b1cf3a51-3803-42fc-9eae-ed403e75eb7d"],
  userid: "8655608901@onemoney",
  redirect: "https://fiu.example.com/consent",
  fi: "KMBL-FIU-D",
});

console.log("Redirect URL:", redirectURL);
