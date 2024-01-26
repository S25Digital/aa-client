import { Axios } from "axios";
import { FlattenedSign, JWK, KeyLike, flattenedVerify, importJWK } from "jose";

interface IOptions {
  privateKey: JWK;
  httpClient: Axios;
}

interface IKey {
  private: Record<string, any>;
  public: Record<string, any>;
}

class AAClient {
  private _pvtKey: JWK;
  private _httpClient: Axios;

  constructor(opts: IOptions) {
    this._pvtKey = opts.privateKey;
    this._httpClient = opts.httpClient;
  }

  private async _generateHeader(token: string, body: Record<string, any>) {
    const signature = await this.generateDetachedJWS(body);
    return {
      client_api_key: token,
      "x-jws-signature": signature,
    };
  }

  private async _postRequest(
    url: string,
    body: Record<string, any>,
    headers: Record<string, any> = {},
  ) {
    try {
      const res = await this._httpClient.request({
        url: `${url}/Consent`,
        method: "POST",
        headers,
        data: JSON.stringify(body),
      });

      return {
        status: res.status,
        data: res.data,
      };
    } catch (err) {
      return Promise.reject({
        status: err.response.status,
        error: err.response.data,
      });
    }
  }

  private async _decryptFI(payload: string, key: IKey) {}

  public async generateDetachedJWS(
    payload: Record<string, any>,
  ): Promise<string> {
    const key = await importJWK(this._pvtKey, "RS256");
    const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));
    const data = await new FlattenedSign(encodedPayload)
      .setProtectedHeader({
        alg: "RS256",
        b64: false,
        crit: ["b64"],
      })
      .sign(key);
    return `${data.protected}..${data.signature}`;
  }

  public async verifySignature(
    payload: Record<string, any>,
    signature: string,
    publicKey: JWK,
  ): Promise<{ isVerified: boolean; message?: string }> {
    try {
      const parts = signature.split(".");
      if (parts.length !== 3) {
        return { isVerified: false, message: "Invalid signature" };
      }

      const key = await importJWK(publicKey, "RS256");
      const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));
      await flattenedVerify(
        {
          protected: parts[0],
          signature: parts[2],
          payload: encodedPayload,
        },
        key,
      );
      return { isVerified: true };
    } catch (error) {
      return Promise.resolve({
        isVerified: false,
        message: error?.message ?? "Invalid Signature",
      });
    }
  }

  public async raiseConsent(url: string, payload: Record<string, any>) {
    // perform basic steps & send request
  }

  public async getConsentByHandle(url: string, handle: string) {
    // perform basic steps & send request
  }

  public async getConsentById(url: string, id: string) {
    // perform basic steps & send request
  }

  public async raiseFIRequest(url: string, payload: Record<string, any>) {
    // generate key andattach to payload
    // return response and key
  }

  public async fetchFI(url: string, payload: Record<string, any>, key: IKey) {
    // fetch infromation
    // decrypt information
    // convert to json
  }
}
