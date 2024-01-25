import { Axios } from "axios";
import { JWK, KeyLike, importJWK } from "jose";

interface IOptions {
  privateKey: JWK;
  httpClient: Axios;
}

interface IKey {
  private: Record<string, any>;
  public: Record<string, any>;
}

class AAClient {
  private _pvtKey: KeyLike | Uint8Array;
  private _httpClient: Axios;

  constructor(opts: IOptions) {
    // this._pvtKey = await importJWK(privateKey, "RS256") // import pvt key
  }

  private async _postRequest() {
    //axios post request wrapper
  }

  private async _decryptFI(payload: string, key: IKey) {

  }

  public async generateDetachedJWS(
    payload: Record<string, any>,
  ): Promise<string> {
    // flattened sign and return detached payload
    return "";
  }

  public async verifySignature(
    payload: Record<string, any>,
    signature: string,
  ): Promise<{ isVerified: boolean }> {
    // validate signature and return
    const response = { isVerified: false };
    return response;
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
