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
import { Logger } from "pino";
interface IOptions {
  privateKey: JWK;
  httpClient: Axios;
  logger: Logger;
}
declare class AAClient {
  private _pvtKey;
  private _httpClient;
  private _logger;
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
    publicKey: JWK,
  ): Promise<IResponse<IConsentResponse>>;
  getConsentByHandle(
    baseUrl: string,
    token: string,
    handle: string,
    publicKey: JWK,
  ): Promise<IResponse<IConsentByHandleResponse>>;
  getConsentById(
    baseUrl: string,
    token: string,
    id: string,
    publicKey: JWK,
  ): Promise<IResponse<IConsentByIdResponse>>;
  raiseFIRequest(
    baseUrl: string,
    token: string,
    body: IFIRequest,
    keys: IKeys,
    publicKey: JWK,
  ): Promise<{
    keys: IKeys;
    response: IResponse<IFIRequestResponse>;
  }>;
  fetchFI(
    baseUrl: string,
    token: string,
    body: IFIFetchRequest,
    publicKey: JWK,
  ): Promise<{
    response: IResponse<IFIFetchResponse>;
  }>;
  generateRedirectUrl(
    url: string,
    ecReq: {
      txnid: string;
      sessionid: string;
      srcref: string[];
      userid: string;
      redirect: string;
      fi: string;
      pan?: string;
      email?: string;
      dob?: string;
      fipid?: string[];
    },
    secret: string,
  ): Promise<{
    url: string;
    reqdate: string;
    ecreq: string;
    fi: string;
  }>;
}
export default AAClient;
