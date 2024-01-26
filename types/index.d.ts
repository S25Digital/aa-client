export * from "./consent";

export interface IError {
  ver: "2.0.0";
  txnid: string;
  timestamp: string;
  errorCode: string;
  errorMsg: string;
}
