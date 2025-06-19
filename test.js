const crypto = require('crypto');
const querystring = require('querystring');

const AES_ALGO = 'aes-256-cbc';
const SECRET_KEY = '14ebbe42dc66271a'; // your shared secret
const IV = Buffer.alloc(16); // zero IV as per guidelines

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, Buffer.from(salt, 'utf8'), 65536, 32, 'sha256');
}

// interface EcreqParams {
//   txnid: string;
//   sessionid: string;
//   srcref: string[];
//   userid: string;
//   redirect: string;
//   fipid?: string[];
//   email?: string;
//   pan?: string;
// }

/**
 * Build AES-encrypted and Base64-URL-encoded ecreq param.
 */
function buildEcreq(params, salt) {
  // 1. URL‑form‑encode the body
  const body = querystring.stringify({
    txnid: params.txnid,
    sessionid: params.sessionid,
    srcref: params.srcref.join('&srcref='),
    userid: params.userid,
    redirect: params.redirect,
    ...(params.fipid && { fipid: params.fipid.join('&fipid=') }),
    ...(params.email && { email: params.email }),
    ...(params.pan && { pan: params.pan }),
  });

  // 2. Encrypt with AES/CBC/PKCS5
  const key = deriveKey(SECRET_KEY, salt);
  const cipher = crypto.createCipheriv(AES_ALGO, key, IV);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(body, 'utf8')), cipher.final()]);

  // 3. Encode to URL-safe Base64
  return encodeURIComponent(encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));
}

function generateReqDateSalt(date) {

  const pad = (num, size = 2) => num.toString().padStart(size, '0');
  const salt = [
    pad(date.getUTCDate()),
    pad(date.getUTCMonth() + 1),
    date.getUTCFullYear(),
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    Math.floor(date.getUTCMilliseconds() / 100).toString() // first digit of milliseconds
  ].join('');

  return salt;
}


// Example usage:
const params = {
  txnid: '21e86bc3-2235-4783-b717-1739614f144c',
  sessionid: '21e86bc3-2235-4783-b717-1739614f144c',
  srcref: ["21e86bc3-2235-4783-b717-1739614f144c"],
  userid: '8655608901@one-money',
  redirect: 'https://fiuexample.com/callback?x=1'
};
const salt = generateReqDateSalt(new Date(new Date().toISOString())); // ddmmyyyyhh24misss in UTC as per spec :contentReference[oaicite:1]{index=1}
console.log(salt);
const ecreq = buildEcreq(params, salt);
console.log('ecreq:', ecreq);