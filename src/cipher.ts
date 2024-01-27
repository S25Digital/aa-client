import crypto from "crypto";
export class Cipher {
  private algorithm = "aes-256-gcm";
  private ivLength = 12;
  private saltIVOffset = 20;
  private _privateKey: string;
  private _publicKey: string;

  constructor(privateKey: string, publicKey: string) {
    this._privateKey = privateKey;
    this._publicKey = publicKey;
  }

  private _createSharedSecret(): Buffer {
    const privateKey = crypto.createPrivateKey(this._privateKey);
    const publicKey = crypto.createPublicKey(this._publicKey);

    return crypto.diffieHellman({ privateKey, publicKey });
  }

  // Method to generate a session key
  private _getSessionKey(sharedSecret: Buffer, xoredNonce: Buffer): Buffer {
    const salt = xoredNonce.subarray(0, 20);
    return crypto.createHmac("sha256", salt).update(sharedSecret).digest();
  }

  // XOR utility method
  private _xor(a: Buffer, b: Buffer): Buffer {
    const length = Math.max(a.length, b.length);
    const buffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = a[i % a.length] ^ b[i % b.length];
    }
    return buffer;
  }

  // Method to encrypt data
  async encrypt(
    yourNonce: string,
    remoteNonce: string,
    data: string,
  ): Promise<string> {
    const sharedSecret = this._createSharedSecret();
    const xoredNonce = this._xor(
      Buffer.from(yourNonce, "base64"),
      Buffer.from(remoteNonce, "base64"),
    );
    const sessionKey = this._getSessionKey(sharedSecret, xoredNonce);
    const iv = xoredNonce.subarray(
      this.saltIVOffset,
      this.saltIVOffset + this.ivLength,
    );
    const cipher = crypto.createCipheriv(this.algorithm, sessionKey, iv);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return `${encrypted}`;
  }

  // Method to decrypt data
  async decrypt(
    yourNonce: string,
    remoteNonce: string,
    base64EncodedData: string,
  ): Promise<string> {
    const sharedSecret = this._createSharedSecret();
    const xoredNonce = this._xor(
      Buffer.from(yourNonce, "base64"),
      Buffer.from(remoteNonce, "base64"),
    );
    const sessionKey = this._getSessionKey(sharedSecret, xoredNonce);
    const iv = xoredNonce.subarray(
      this.saltIVOffset,
      this.saltIVOffset + this.ivLength,
    );
    const decipher = crypto.createDecipheriv(this.algorithm, sessionKey, iv);
    let decrypted = decipher.update(base64EncodedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}