import { expect } from "chai";
import { SinonFakeTimers, useFakeTimers, stub } from "sinon";
import proxyquire from "proxyquire";

const { baseMapper } = proxyquire("../src/mapper.ts", {
  uuid: {
    v4: stub().returns(uuid),
  },
});
const AAClient = proxyquire("../src/client.ts", {
  "./mapper": { baseMapper },
}).default;
import {
  baseUrl,
  consentDetail,
  keyPair,
  publicKey,
  setupNock,
  uuid,
} from "./data";
import { Scope } from "nock";
import axios from "axios";

const aaClient = new AAClient({
  privateKey: keyPair,
  httpClient: axios,
});

const body = {
  foo: "bar",
};
let clock: SinonFakeTimers;
let nockServer: Scope;

describe("AA Client", () => {
  before(() => {
    clock = useFakeTimers(new Date("2023-06-26T11:39:57.153Z"));
  });
  after(() => {
    clock.restore();
  });
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

  describe("The raiseConsent method", () => {
    beforeEach(() => {
      nockServer = setupNock();
    });
    afterEach(() => {
      nockServer.removeAllListeners();
    });
    describe("when it is successful", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.raiseConsent(
          baseUrl,
          "token",
          consentDetail,
        );

        expect(res).to.deep.equal({
          data: {
            ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
            Customer: {
              id: "9999999999@AA_identifier",
            },
            timestamp: "2023-06-26T11:39:57.153Z",
            txnid: "d5e26bff-3887-46a2-8ed2-962adeede7e4",
            ver: "2.0.0",
          },
          status: 200,
        });
      });
    });
    describe("when there is an error", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.raiseConsent(
          baseUrl,
          "token",
          Object.assign({}, consentDetail, { consentMode: "STORE" }),
        );

        expect(res).to.deep.equal({
          error: {
            errorCode: "InvalidRequest",
            errorMsg: "Error code specific error message",
            timestamp: "2023-06-26T11:33:34.509Z",
            txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
            ver: "2.0.0"
          },
          status: 400,
        });
      });
    });
  });
});
