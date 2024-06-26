import { expect } from "chai";
import { Cipher } from "../src/cipher";
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
        participantB.keyMaterial.Nonce,
        participantA.keyMaterial.Nonce,
        JSON.stringify(data),
      );

      console.log(encryptedData);

      const decryptedData = await cipher2.decrypt(
        participantA.keyMaterial.Nonce,
        participantB.keyMaterial.Nonce,
        encryptedData,
      );
      expect(JSON.parse(decryptedData)).to.deep.equal({ foo: "bar" });
    });
  });
});
