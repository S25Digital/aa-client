import { expect } from "chai";
import { SinonFakeTimers, useFakeTimers, stub, spy } from "sinon";
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
  dateTime,
  keyPair,
  publicKey,
  setupNock,
  uuid,
  logger
} from "./data";
import { Scope } from "nock";
import axios from "axios";

const aaClient = new AAClient({
  privateKey: keyPair,
  httpClient: axios,
  logger,
});

const body = {
  foo: "bar",
};
let clock: SinonFakeTimers;
let nockServer: Scope;

describe("AA Client", () => {
  before(() => {
    clock = useFakeTimers(new Date(dateTime));
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
    beforeEach(async() => {
      nockServer = await setupNock();
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
          publicKey,
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
            ver: "2.0.0",
          },
          status: 400,
        });
      });
    });
  });
  describe("The getConsentByHandle method", () => {
    beforeEach(async() => {
      nockServer = await setupNock();
    });
    afterEach(() => {
      nockServer.removeAllListeners();
    });
    describe("when it is successful", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.getConsentByHandle(baseUrl, "token", uuid, publicKey);

        expect(res).to.deep.equal({
          data: {
            ver: "2.0.0",
            timestamp: "2023-06-26T11:39:57.153Z",
            txnid: "795038d3-86fb-4d3a-a681-2d39e8f4fc3c",
            ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
            ConsentStatus: {
              id: "654024c8-29c8-11e8-8868-0289437bf331",
              status: "APPROVED",
            },
          },
          status: 200,
        });
      });
    });
    describe("when there is an error", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.getConsentByHandle(
          baseUrl,
          "token",
          "654024c8-bf331",
        );

        expect(res).to.deep.equal({
          error: {
            errorCode: "InvalidRequest",
            errorMsg: "Error code specific error message",
            timestamp: "2023-06-26T11:33:34.509Z",
            txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
            ver: "2.0.0",
          },
          status: 400,
        });
      });
    });
  });

  describe("The getConsentById method", () => {
    beforeEach(async() => {
      nockServer = await setupNock();
    });
    afterEach(() => {
      nockServer.removeAllListeners();
    });
    describe("when it is successful", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.getConsentById(baseUrl, "token", uuid, publicKey);

        expect(res).to.deep.equal({
          data: {
            ver: "2.0.0",
            txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
            consentId: uuid,
            status: "ACTIVE",
            createTimestamp: dateTime,
            signedConsent:
              "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQyNzE5MTNlLTdiOTMtNDlkZC05OTQ5LTFjNzZmZjVmYzVjZiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.ew0KICAgICAgICAiY29uc2VudFN0YXJ0IjogIjIwMTktMDUtMjhUMTE6Mzg6MjAuMzgwKzAwMDAiLA0KICAgICAgICAiY29uc2VudEV4cGlyeSI6ICIyMDIwLTA1LTI4VDExOjM4OjIwLjM4MSswMDAwIiwNCiAgICAgICAgImNvbnNlbnRNb2RlIjogIlZJRVciLA0KICAgICAgICAiZmV0Y2hUeXBlIjogIk9ORVRJTUUiLA0KICAgICAgICAiY29uc2VudFR5cGVzIjogWw0KICAgICAgICAgICAgIlBST0ZJTEUiLA0KICAgICAgICAgICAgIlNVTU1BUlkiLA0KICAgICAgICAgICAgIlRSQU5TQUNUSU9OUyINCiAgICAgICAgXSwNCiAgICAgICAgImZpVHlwZXMiOiBbDQogICAgICAgICAgICAiREVQT1NJVCIsDQogICAgICAgICAgICAiVEVSTS1ERVBPU0lUIg0KICAgICAgICBdLA0KICAgICAgICAiRGF0YUNvbnN1bWVyIjogew0KICAgICAgICAgICAgImlkIjogImNvb2tpZWphci1hYUBmaW52dS5pbiIsDQogICAgICAgICAgICAidHlwZSI6ICJBQSINCiAgICAgICAgfSwNCiAgICAgICAgIkRhdGFQcm92aWRlciI6IHsNCiAgICAgICAgICAgICJpZCI6ICJCQVJCMEtJTVhYWCIsDQogICAgICAgICAgICAidHlwZSI6ICJGSVAiDQogICAgICAgIH0sDQogICAgICAgICJDdXN0b21lciI6IHsNCiAgICAgICAgICAgICJpZCI6ICJkZW1vQGZpbnZ1Ig0KICAgICAgICB9LA0KICAgICAgICAiQWNjb3VudHMiOiBbDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgImZpVHlwZSI6ICJERVBPU0lUIiwNCiAgICAgICAgICAgICAgICAiZmlwSWQiOiAiQkFSQjBLSU1YWFgiLA0KICAgICAgICAgICAgICAgICJhY2NUeXBlIjogIlNBVklOR1MiLA0KICAgICAgICAgICAgICAgICJsaW5rUmVmTnVtYmVyIjogIlVCSTQ4NTk2NDU3OSIsDQogICAgICAgICAgICAgICAgIm1hc2tlZEFjY051bWJlciI6ICJVQkk4NTIxNzg4MTI3OSINCiAgICAgICAgICAgIH0sDQogICAgICAgICAgICB7DQogICAgICAgICAgICAgICAgImZpVHlwZSI6ICJERVBPU0lUIiwNCiAgICAgICAgICAgICAgICAiZmlwSWQiOiAiQkFSQjBLSU1YWFgiLA0KICAgICAgICAgICAgICAgICJhY2NUeXBlIjogIlNBVklOR1MiLA0KICAgICAgICAgICAgICAgICJsaW5rUmVmTnVtYmVyIjogIlVCSTQ4NTk2NDUiLA0KICAgICAgICAgICAgICAgICJtYXNrZWRBY2NOdW1iZXIiOiAiVUJJODUyMTc4ODEyIg0KICAgICAgICAgICAgfQ0KICAgICAgICBdLA0KICAgICAgICAiUHVycG9zZSI6IHsNCiAgICAgICAgICAgICJjb2RlIjogIjEwMSIsDQogICAgICAgICAgICAicmVmVXJpIjogImh0dHBzOi8vYXBpLnJlYml0Lm9yZy5pbi9hYS9wdXJwb3NlLzEwMS54bWwiLA0KICAgICAgICAgICAgInRleHQiOiAiV2VhbHRoIG1hbmFnZW1lbnQgc2VydmljZSIsDQogICAgICAgICAgICAiQ2F0ZWdvcnkiOiB7DQogICAgICAgICAgICAgICAgInR5cGUiOiAicHVycG9zZUNhdGVnb3J5VHlwZSINCiAgICAgICAgICAgIH0NCiAgICAgICAgfSwNCiAgICAgICAgIkZJRGF0YVJhbmdlIjogew0KICAgICAgICAgICAgImZyb20iOiAiMjAxOS0wNS0yOFQxMTozODoyMC4zODMrMDAwMCIsDQogICAgICAgICAgICAidG8iOiAiMjAyMC0wNS0yOFQxMTozODoyMC4zODErMDAwMCINCiAgICAgICAgfSwNCiAgICAgICAgIkRhdGFMaWZlIjogew0KICAgICAgICAgICAgInVuaXQiOiAiTU9OVEgiLA0KICAgICAgICAgICAgInZhbHVlIjogNA0KICAgICAgICB9LA0KICAgICAgICAiRnJlcXVlbmN5Ijogew0KICAgICAgICAgICAgInVuaXQiOiAiSE9VUiIsDQogICAgICAgICAgICAidmFsdWUiOiA0DQogICAgICAgIH0sDQogICAgICAgICJEYXRhRmlsdGVyIjogWw0KICAgICAgICAgICAgew0KICAgICAgICAgICAgICAgICJ0eXBlIjogIlRSQU5TQUNUSU9OQU1PVU5UIiwNCiAgICAgICAgICAgICAgICAib3BlcmF0b3IiOiAiPiIsDQogICAgICAgICAgICAgICAgInZhbHVlIjogIjIwMDAwIg0KICAgICAgICAgICAgfQ0KICAgICAgICBdDQogICAgfQ.O3KPh-eTpW2w47QXYidOBe1Hk2y7djVAEcOnZyRRvxQ3cY18-9ZWiodF16jff-e7yNQgsYZpAy95Fx2Fft8LoYugkYh9_6qHiG_7LCtW8Ng4nCMgZM3Wwsj11ks1msrK5C1ksPrGlTkFhm9-FufNkPTAlW76_5Sb8G_lOsIj1lB8TrvKpOvPlhEIgsS4WBNdPfv3SBqTV2suw2LvkX3QTilqwuMgXMkrm9-RYL90fweX_yyoyaBWHOJNQaKNuQWPpoRRNHGOx3v4_QiwgrELdfeTVtKn6R_AsfaBoEthQ3wrc8tY1q0Wx5j0x18NdU2R2C26dHyZ9M11dEH99psA1A",
            ConsentUse: {
              logUri: "string",
              count: 1,
              lastUseDateTime: dateTime,
            },
          },
          status: 200,
        });
      });
    });
    describe("when there is an error", () => {
      it("should return the appropriate response", async () => {
        const res = await aaClient.getConsentById(
          baseUrl,
          "token",
          "654024c8-bf331",
        );

        expect(res).to.deep.equal({
          error: {
            errorCode: "InvalidRequest",
            errorMsg: "Error code specific error message",
            timestamp: "2023-06-26T11:33:34.509Z",
            txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
            ver: "2.0.0",
          },
          status: 400,
        });
      });
    });
  });
});
