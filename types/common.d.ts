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
  meta?: {
    transactionId: string;
  };
}
