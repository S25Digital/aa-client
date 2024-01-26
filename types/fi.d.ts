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
  nonce: string;
}

export interface IFIFetchRequest {
  sessionId: string;
  fipId?: string;
  linkRefNumber?: Array<{
    id: string;
  }>;
}

export interface IFIFetchResponse {
  ver: string;
  timestamp: string;
  txnid: string;
  FI: Fi[];
}

interface Fi {
  fipID: string;
  data: FIData[];
  KeyMaterial: KeyMaterial;
}

interface KeyMaterial {
  cryptoAlg: string;
  curve: string;
  params: string;
  DHPublicKey: DHPublicKey;
  Nonce: string;
}

interface DHPublicKey {
  expiry: string;
  Parameters: string;
  KeyValue: string;
}

interface FIData {
  linkRefNumber: string;
  maskedAccNumber: string;
  encryptedFI: string;
}
