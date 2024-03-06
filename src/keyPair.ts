import { generateKeyPairSync } from "crypto";
import { FITypes } from "../types";
import { v4 } from "uuid";

export function createKeyJson(): FITypes.IKeys {
  const { privateKey, publicKey } = generateKeyPairSync("x25519", {
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 2);
  const expiryISO = expiryDate.toISOString();

  return {
    privateKey,
    keyMaterial: {
      cryptoAlg: "ECDH",
      curve: "X25519",
      params: "",
      DHPublicKey: {
        Parameters: "",
        expiry: expiryISO,
        KeyValue: publicKey.toString(),
      },
      Nonce: Buffer.from(v4().replace(/-/g, "")).toString("base64")
    },
  };
}
