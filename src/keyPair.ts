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
      cipher: "aes-256-cbc",
    },
  });

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  const expiryISO = expiryDate.toISOString();

  return {
    privateKey,
    keyMaterial: {
      cryptoAlg: "ECDH",
      curve: "Curve25519",
      DHPublicKey: {
        expiry: expiryISO,
        KeyValue: publicKey.toString(),
      },
    },
    nonce: v4()
  };
}
