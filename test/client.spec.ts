import { expect } from "chai";

import { createAAClient } from "../src";
import { keyPair, publicKey } from "./data";

const aaClient = createAAClient(keyPair);

const body = {
  foo: "bar",
};

describe("AA Client", () => {
  describe("The generateDetachedJWS method", () => {
    it("should return a detached signature", async () => {
      const signature = await aaClient.generateDetachedJWS(body);
      const parts = signature.split(".");
      expect(signature).to.equal(
        "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Ge_QjVKB6fMl4zv10xqlZde56LBhO2Q7RGW41rE6BlcQP-_YqWRCc3xSETQgPo8Ji8K5RJrx4jJkVCnT3MhQwvrt8enor-R_-nMiJ34hr-iXF_gVDIU8DVgYAwPFdheP8_3F_M88lh5Sx9t38xAepNJ5eMzGsrV24EPPRR3KmBicB7NcqOTgrl_G-qzVL8lHj8ad7mTA_qgSbnQW7C8gsWk1nRMje3KGrWoOFwYSdtsDxLDdpaSYgWivze3ZgSHwo_c12KTfB0TywwN4_biYig5FXOl9IHnxAuvwErmXBJOZQw-u9xZj3db81ggek4ne0B5O1fAeoUjfI9oLXXFIEQ",
      );
      expect(parts.length).to.equal(3);
      expect(parts[1]).to.equal("");
    });
  });

  describe("The verifySignature method", () => {
    describe("when the signature provided is valid", () => {
      it("should verify a detached signature", async () => {
        const signature = await aaClient.generateDetachedJWS(body);
        const res = await aaClient.verifySignature(body, signature, publicKey);
        expect(res).to.deep.equal({ isVerified: true });
      });
    });

    describe("when the signature provided is not valid", () => {
      it("should return appropriate response", async () => {
        const signature = await aaClient.generateDetachedJWS(body);
        const res = await aaClient.verifySignature(
          body,
          `${signature}po`,
          publicKey,
        );
        expect(res).to.deep.equal({
          isVerified: false,
          message: "signature verification failed",
        });
      });
    });
  });
});
