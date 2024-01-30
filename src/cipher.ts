/**
 * This file is an implementation based on the Sahamati package Rahasya - https://github.com/Sahamati/rahasya
 */
import crypto, { CipherGCMTypes } from "crypto";
export class Cipher {
  private algorithm: CipherGCMTypes = "aes-256-gcm";
  private ivLength = 12;
  private saltIVOffset = 20;
  private _privateKey: string;
  private _publicKey: string;
  private _gcmTagLength = 16;

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
    const cipher = crypto.createCipheriv(this.algorithm, sessionKey, iv, {
      authTagLength: this._gcmTagLength,
    });
    let encrypted = cipher.update(data, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${encrypted.toString("base64")}:${authTag.toString("base64")}`;
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
    const [encryptedData, authTag] = base64EncodedData.split(":");
    const decipher = crypto.createDecipheriv(this.algorithm, sessionKey, iv, {
      authTagLength: this._gcmTagLength,
    });
    decipher.setAuthTag(Buffer.from(authTag, "base64"));
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
