import { expect } from "chai";
import { Cipher } from "../src";
import { createKeyJson } from "../src/keyPair";

const participantA = createKeyJson();
const participantB = createKeyJson();

const data = {
  foo: "bar",
};

const cipher = new Cipher(
  participantB.privateKey,
  participantA.keyMaterial.DHPublicKey.KeyValue,
);

const cipher2 = new Cipher(
  participantA.privateKey,
  participantB.keyMaterial.DHPublicKey.KeyValue,
);

describe("The Cipher Class", () => {
  describe("The decrypt method", () => {
    it("should decrypt the data", async () => {
      const encryptedData = await cipher.encrypt(
        participantB.nonce,
        participantA.nonce,
        JSON.stringify(data),
      );

      const decryptedData = await cipher2.decrypt(
        participantA.nonce,
        participantB.nonce,
        encryptedData,
      );
      expect(JSON.parse(decryptedData)).to.deep.equal({ foo: "bar" });
    });
  });
});
