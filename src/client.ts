import { Axios } from "axios";
import { FlattenedSign, JWK, flattenedVerify, importJWK } from "jose";
import { v4 } from "uuid";

import {
  IConsentByHandleResponse,
  IConsentByIdResponse,
  IConsentResponse,
  IConstentDetail,
  IError,
} from "../types";

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
  private _version: string = "2.0.0";

  constructor(opts: IOptions) {
    this._pvtKey = opts.privateKey;
    this._httpClient = opts.httpClient;
  }

  private async _generateHeader(token: string, payload: Record<string, any>) {
    const signature = await this.generateDetachedJWS(payload);
    return {
      client_api_key: token,
      "x-jws-signature": signature,
    };
  }

  private async _postRequest<T = Record<string, any>>(
    url: string,
    payload: Record<string, any>,
    headers: Record<string, any> = {},
  ): Promise<{
    status: number;
    data?: T;
    error?: IError;
  }> {
    try {
      const res = await this._httpClient.request({
        url,
        method: "POST",
        headers,
        data: JSON.stringify(payload),
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

  public async raiseConsent(
    baseUrl: string,
    token: string,
    consentDetail: IConstentDetail,
  ) {
    const payload = {
      ConsentDetail: consentDetail,
      ver: this._version,
      timestamp: new Date().toISOString(),
      txnid: v4(),
    };
    const headers = this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent`;
    return await this._postRequest<IConsentResponse>(url, payload, headers);
  }

  public async getConsentByHandle(
    baseUrl: string,
    token: string,
    handle: string,
  ) {
    const payload = {
      ver: this._version,
      timestamp: new Date().toISOString(),
      txnid: v4(),
      ConsentHandle: handle,
    };
    const headers = this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent/handle`;

    return await this._postRequest<IConsentByHandleResponse>(
      url,
      payload,
      headers,
    );
  }

  public async getConsentById(baseUrl: string, token: string, id: string) {
    const payload = {
      ver: this._version,
      timestamp: new Date().toISOString(),
      txnid: v4(),
      consentId: id,
    };
    const headers = this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent/fetch`;

    return await this._postRequest<IConsentByIdResponse>(url, payload, headers);
  }

  public async raiseFIRequest(
    baseUrl: string,
    token: string,
    payload: Record<string, any>,
  ) {
    // generate key andattach to payload
    // return response and key
  }

  public async fetchFI(
    baseUrl: string,
    token: string,
    payload: Record<string, any>,
    key: IKey,
  ) {
    // fetch infromation
    // decrypt information
    // convert to json
  }
}

export default AAClient;
