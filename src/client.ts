import { Axios } from "axios";
import { FlattenedSign, JWK, flattenedVerify, importJWK } from "jose";

import { ConsentTypes, FITypes, IResponse } from "../types";
import { baseMapper } from "./mapper";

interface IOptions {
  privateKey: JWK;
  httpClient: Axios;
}

class AAClient {
  private _pvtKey: JWK;
  private _httpClient: Axios;

  constructor(opts: IOptions) {
    this._pvtKey = opts.privateKey;
    this._httpClient = opts.httpClient;
  }

  private async _generateHeader(token: string, payload: Record<string, any>) {
    const signature = await this.generateDetachedJWS(payload);
    return {
      client_api_key: token,
      "x-jws-signature": signature,
      "Content-Type": "application/json"
    };
  }

  private async _postRequest<T = Record<string, any>>(
    url: string,
    payload: Record<string, any>,
    headers: Record<string, any> = {},
  ): Promise<IResponse<T>> {
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
      return Promise.resolve({
        status: err.response.status,
        error: err.response.data,
      });
    }
  }

  private async _getRequest<T = Record<string, any>>(
    url: string,
    headers: Record<string, any> = {},
  ): Promise<IResponse<T>> {
    try {
      const res = await this._httpClient.request({
        url,
        method: "GET",
        headers,
      });

      return {
        status: res.status,
        data: res.data,
      };
    } catch (err) {
      return Promise.resolve({
        status: err.response.status,
        error: err.response.data,
      });
    }
  }

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
      await flattenedVerify(
        {
          protected: parts[0],
          signature: parts[2],
          payload: JSON.stringify(payload),
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
    consentDetail: ConsentTypes.IConstentDetail,
  ) {
    const payload = {
      ConsentDetail: consentDetail,
      ...baseMapper.execute({}),
    };
    const headers = await this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent`;
    return await this._postRequest<ConsentTypes.IConsentResponse>(
      url,
      payload,
      headers,
    );
  }

  public async getConsentByHandle(
    baseUrl: string,
    token: string,
    handle: string,
  ) {
    const payload = {
      ...baseMapper.execute({}),
      ConsentHandle: handle,
    };
    const headers = await this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent/handle`;

    return await this._postRequest<ConsentTypes.IConsentByHandleResponse>(
      url,
      payload,
      headers,
    );
  }

  public async getConsentById(baseUrl: string, token: string, id: string) {
    const payload = {
      ...baseMapper.execute({}),
      consentId: id,
    };
    const headers = await this._generateHeader(token, payload);
    const url = `${baseUrl}/Consent/fetch`;

    return await this._postRequest<ConsentTypes.IConsentByIdResponse>(
      url,
      payload,
      headers,
    );
  }

  public async raiseFIRequest(
    baseUrl: string,
    token: string,
    body: FITypes.IFIRequest,
    keys: FITypes.IKeys
  ): Promise<{
    keys: FITypes.IKeys;
    response: IResponse<FITypes.IFIRequestResponse>;
  }> {
    if(!keys) {
      throw new Error("Keys are required");
    }

    const payload = {
      ...baseMapper.execute({}),
      ...body,
      KeyMaterial: keys.keyMaterial,
    };

    const headers = await this._generateHeader(token, payload);
    const url = `${baseUrl}/FI/request`;

    const response = await this._postRequest<FITypes.IFIRequestResponse>(
      url,
      payload,
      headers,
    );
    return { response, keys };
  }

  public async fetchFI(
    baseUrl: string,
    token: string,
    body: FITypes.IFIFetchRequest,
  ): Promise<{
    response: IResponse<FITypes.IFIFetchResponse>;
    FIData?: Array<Record<string, any>>;
  }> {
    const payload = {
      ...baseMapper.execute({}),
      ...body,
    };
    const headers = await this._generateHeader(token, payload);
    const url = `${baseUrl}/FI/fetch`;

    const response = await this._postRequest<FITypes.IFIFetchResponse>(
      url,
      payload,
      headers,
    );

    if (!response.data) {
      return {
        response,
      };
    }

    return {
      response
    };
  }

  public async getHeartBeat(baseUrl: string) {
    const headers = {
      "Content-Type": "application/json"
    };
    const url = `${baseUrl}/Heartbeat`;

    return await this._getRequest<ConsentTypes.IHeartbeat>(
      url,
      headers,
    );
  }
}

export default AAClient;
