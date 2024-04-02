import { Axios } from "axios";
import { JWK } from "jose";
import {
  IConsentByHandleResponse,
  IConsentByIdResponse,
  IConsentResponse,
  IConstentDetail,
} from "./consent";
import {
  IFIFetchRequest,
  IFIFetchResponse,
  IFIRequest,
  IFIRequestResponse,
  IKeys,
  KeyMaterial,
} from "./fi";
import { IResponse } from "./common";
interface IOptions {
  privateKey: JWK;
  httpClient: Axios;
}
declare class AAClient {
  private _pvtKey;
  private _httpClient;
  private _parser;
  constructor(opts: IOptions);
  private _generateHeader;
  private _postRequest;
  generateDetachedJWS(payload: Record<string, any>): Promise<string>;
  verifySignature(
    payload: Record<string, any>,
    signature: string,
    publicKey: JWK,
  ): Promise<{
    isVerified: boolean;
    message?: string;
  }>;
  raiseConsent(
    baseUrl: string,
    token: string,
    consentDetail: IConstentDetail,
  ): Promise<IResponse<IConsentResponse>>;
  getConsentByHandle(
    baseUrl: string,
    token: string,
    handle: string,
  ): Promise<IResponse<IConsentByHandleResponse>>;
  getConsentById(
    baseUrl: string,
    token: string,
    id: string,
  ): Promise<IResponse<IConsentByIdResponse>>;
  raiseFIRequest(
    baseUrl: string,
    token: string,
    body: IFIRequest,
    keys?: IKeys
  ): Promise<{
    keys: IKeys;
    response: IResponse<IFIRequestResponse>;
  }>;
  fetchFI(
    baseUrl: string,
    token: string,
    body: IFIFetchRequest,
  ): Promise<{
    response: IResponse<IFIFetchResponse>;
  }>;
}
export default AAClient;
