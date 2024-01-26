import AAClient from "src/client";

export * from "./consent";
export * from "./fi";

export interface IError {
  ver: "2.0.0";
  txnid: string;
  timestamp: string;
  errorCode: string;
  errorMsg: string;
}

export interface IResponse<T> {
  status: number;
  data?: T;
  error?: IError;
}

export function createAAClient(privateKey: JWK): AAClient;
