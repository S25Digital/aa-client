import crypto, { CipherKey } from "crypto";

const AES_ALGO = "aes-256-cbc";
const SECRET_KEY = "ac12ghd75kf75r";
const IV = Buffer.alloc(16, 0); // 16 bytes of zeros

function getKeyFromPassword(password: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(password, salt, 65536, 32, "sha256");
}

export function encrypt(plainText: string, date: Date): string {
  const salt =  generateReqDateSalt(date);
  const key = getKeyFromPassword(SECRET_KEY, salt) as crypto.CipherKey;
  const cipher = crypto.createCipheriv(AES_ALGO, key, IV as crypto.BinaryLike);
  const encryptedPart = cipher.update(Buffer.from(plainText, "utf8") as any);
  const finalPart = cipher.final();
  const encrypted = Buffer.concat([encryptedPart as any, finalPart]);
  return encodeURIComponent(encrypted.toString("base64"));
}

export function decrypt(encryptedText: string, salt: string): string {
  const key = getKeyFromPassword(SECRET_KEY, salt) as crypto.CipherKey;
  const decipher = crypto.createDecipheriv(
    AES_ALGO,
    key,
    IV as crypto.BinaryLike,
  );
  const decoded = Buffer.from(decodeURIComponent(encryptedText), "base64");
  const decryptedPart = decipher.update(Uint8Array.from(decoded));
  const finalPart = decipher.final();
  const decrypted = Buffer.concat([decryptedPart as any, finalPart]);
  return decrypted.toString("utf8");
}

function xor(a: Buffer, key: Buffer): Buffer {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] ^ key[i % key.length];
  }
  return out;
}

export function encryptValueToXor(value: string, key: string): string {
  return xor(Buffer.from(value), Buffer.from(key)).toString("base64");
}

export function decryptXoredValue(xoredValue: string, key: string): string {
  const decoded = Buffer.from(xoredValue, "base64");
  return xor(decoded, Buffer.from(key)).toString("utf8");
}

export function generateReqDateSalt(date: Date): string {

  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
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

// Sample test
// const salt = '031120201803460';
// const payload = 'txnid=T1234&sessionid=S1234&srcref=Srcref1234&userid=acme@perfios-aa&redirect=https://example.com';

// const enc = encrypt(payload, salt);
// console.log('Encrypted:', enc);

// const dec = decrypt(enc, salt);
// console.log('Decrypted:', dec);

// const fi = 'FIUID';
// const xored = encryptValueToXor(fi, salt);
// console.log('Xored FI:', xored);

// const xoredDec = decryptXoredValue(xored, salt);
// console.log('Decrypted Xored FI:', xoredDec);
