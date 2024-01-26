export interface IFIRequest {
  FIDataRange: FIDataRange;
  Consent: Consent;
}

interface Consent {
  id: string;
  digitalSignature: string;
}

interface FIDataRange {
  from: string;
  to: string;
}

export interface IFIRequestResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  consentId: string;
  sessionId: string;
}

export interface IKeys {
  privateKey: string;
  keyMaterial: {
    cryptoAlg: "ECDH";
    curve: "Curve25519";
    DHPublicKey: {
      expiry: string;
      KeyValue: string;
    };
  };
  nounce: string;
}
