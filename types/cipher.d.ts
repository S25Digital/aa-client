export declare class Cipher {
    private algorithm;
    private ivLength;
    private saltIVOffset;
    private _privateKey;
    private _publicKey;
    constructor(privateKey: string, publicKey: string);
    private _createSharedSecret;
    private _getSessionKey;
    private _xor;
    encrypt(yourNonce: string, remoteNonce: string, data: string): Promise<string>;
    decrypt(yourNonce: string, remoteNonce: string, base64EncodedData: string): Promise<string>;
}
