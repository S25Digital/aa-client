import nock from "nock";
import { spy } from "sinon";
import AAClient from "../src/client.ts";
import { IConstentDetail } from "../types/consent";
import axios from "axios";
import { expect } from "chai";

export const logger: any = {
  error: spy(),
  debug: spy(),
};

export const keyPair = {
  kid: "8a893a8b-857a-412a-b000-0123456789ab",
  p: "xfwDuWwaJFi1PgXh7_9U3eyEbNysqo1fL3wfUsCMU3-zLWob-xrwRAjDRqnc32bs8Cwzzn7iIPLS2Bru_B6SgD6zB3syF3PCUdfmGUINLOcS2pQBmOU-iLCOWIfuL0Nvcx2Ot3nQ5zD9yrabiv18-6ShcbmhbSQfAMEKlqQFopk",
  kty: "RSA",
  q: "t3zOBIqi8eQqzFrGFbtQOmfZl4uV-mAq3qLJHlFWSQFhtJfWxCopDxPHM36al5SK_RCm7WdGVI2-H8v7Ogv4GceRm1srKJcKUmc9N7oQEdN1pwFx89lqvF25rL4SW0dnvcND8PaHCz4lXUcM1c5G6nAeebjm8WOC_4G3pOuvPFE",
  d: "Xg4F_0K2JKPjdluj8ZzwBLq0N_QETcx0jTHCA6d2n233TZNxsm1b38C6EYFB4bcePsY0vJiq9y1H_H51ZrAmPz50nAAa9YRv3_q-PnhRvp6BHeLhlFcwsNk5UpFYDlKJESXmo1ZdJI2aDx-BhACV-7P6QJumbA1p9xjq8MSQaa81un_84dQ6nhVCiSkkZF6-r-j_YfEnKdNX2AzSttIGfPvY04bcj1mfOO6d1ouWpTkH6eQgkhvpULGQDOe_5xBRRt8LrCNwh-Ekf6GJOvitF6Zc7AQdvGX2LZWDRuVjjDbXKcdnohBd7UeoWh9hdPjoXi46wrNKiET_w9oea3pJAQ",
  e: "AQAB",
  use: "sig",
  qi: "qs33i0GV3WI12Z4A-oGu122NfEYmQHqBA9TgQFCX0FqG6ZdEpbE6AJuOSZBPUwSAXkjHBAZU_8juNMLlOoRReyXUxxeDecgPkx2eSLmSrik5lgv3ZnxrgxeHuVPjWld1iHXgqK6BjyaUqzimpnIqSlWRPr2dAo_iiDWfrZXE0HQ",
  dp: "iGucjVmlscHGMRSQmHSRn9FndjOgbmy3V9rpInY2uxpU9kgVO7NWNyrqk3hcDzu2q89pazIW0qk_C1WTsvnF7MRHTDJhU7OaBBcGIAVZWsVmQmKVryrXKgyuKOaRAtQuqV2Gh3pSrdseJV4qU11Tj3njHJ_SUYgALN7XUvF2SJE",
  alg: "RS256",
  dq: "aRa669D3ODEk7fvDXaj1by4RaoFQuaCgjPiQ1aNiFtgKvKMGJz26XF9IhM6q_cveusfxwyCWIFE6Jf3u-jTmuOUbGO5jTpELIVztq-AN2hfRV4A1YqMQRagscqo92zePTBjs7bJUb_T882qBCGdnKFhkq_RhmLkUyv_hTTyLFbE",
  n: "jeesD6g-LxbC2dco_ZC3snVJDyXHUM3EJ-CALeIlN2_02M0WiSupFv_zqRROJCUCu-LWFyhkJAWzLvAoY4OnT8ouGe939wnTovIp2cdCUZcqZluItjrwzpCvdXLhAp7EIeShKHJiD40j3zHHp9iktkjOuOyg3bX9dQCK3Bsd6qtWCwK_lt7S2pVWtkxUTz_N9T64ApDkbgUGrftCEsYJKXWqARkFD72aLZV3lWXfucEnWkZZ6nOJyoLB-slUsvbm3tG3hMIaWvvcuOilauAVRqchyDA4sgASbaW-UZGqDudJxpy0rqw5MFuW_Kd92k_7exBJ160v4utyC3070XtOaQ",
};

export const publicKey = {
  kty: "RSA",
  e: "AQAB",
  use: "sig",
  alg: "RS256",
  n: "jeesD6g-LxbC2dco_ZC3snVJDyXHUM3EJ-CALeIlN2_02M0WiSupFv_zqRROJCUCu-LWFyhkJAWzLvAoY4OnT8ouGe939wnTovIp2cdCUZcqZluItjrwzpCvdXLhAp7EIeShKHJiD40j3zHHp9iktkjOuOyg3bX9dQCK3Bsd6qtWCwK_lt7S2pVWtkxUTz_N9T64ApDkbgUGrftCEsYJKXWqARkFD72aLZV3lWXfucEnWkZZ6nOJyoLB-slUsvbm3tG3hMIaWvvcuOilauAVRqchyDA4sgASbaW-UZGqDudJxpy0rqw5MFuW_Kd92k_7exBJ160v4utyC3070XtOaQ",
};
const aaClient = new AAClient({
  privateKey: keyPair,
  httpClient: axios,
  logger,
});

export const baseUrl = "https://localhost:3000/v2";
export const dateTime = "2023-06-26T11:39:57.153Z";
export const uuid = "d5e26bff-3887-46a2-8ed2-962adeede7e4";
export const consentDetail: IConstentDetail = {
  consentStart: "2019-12-06T11:39:57.153Z",
  consentExpiry: "2019-12-06T11:39:57.153Z",
  consentMode: "VIEW",
  fetchType: "ONETIME",
  consentTypes: ["PROFILE"],
  fiTypes: ["DEPOSIT"],
  DataConsumer: {
    id: "DC1",
    type: "FIU",
  },
  Customer: {
    id: "9999999999@AA_identifier",
    Identifiers: [
      {
        type: "MOBILE",
        value: "9999999999",
      },
    ],
  },
  Purpose: {
    code: "101",
    refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
    text: "Wealth management service",
  },
  FIDataRange: {
    from: "2023-07-06T11:39:57.153Z",
    to: "2019-12-06T11:39:57.153Z",
  },
  DataLife: {
    unit: "MONTH",
    value: 0,
  },
  Frequency: {
    unit: "HOUR",
    value: 1,
  },
  DataFilter: [
    {
      type: "TRANSACTIONAMOUNT",
      operator: ">=",
      value: "20000",
    },
  ],
};

function matchBody(
  original: Record<string, any>,
  expected: Record<string, any>,
) {
  delete original.timestamp;

  const result = expect(original).to.deep.equal(expected);

  return result.deep;
}

export async function setupNock() {
  const signature = await aaClient.generateDetachedJWS({
    ver: "2.0.0",
    timestamp: dateTime,
    txnid: uuid,
    Customer: {
      id: "9999999999@AA_identifier",
    },
    ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
  });
  const handleSignature = await aaClient.generateDetachedJWS({
    ver: "2.0.0",
    timestamp: "2023-06-26T11:39:57.153Z",
    txnid: "795038d3-86fb-4d3a-a681-2d39e8f4fc3c",
    ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
    ConsentStatus: {
      id: "654024c8-29c8-11e8-8868-0289437bf331",
      status: "APPROVED",
    },
  });
  const fetchSignature = await aaClient.generateDetachedJWS({
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
  });

  return nock(baseUrl)
    .post(
      "/Consent",
      (body) =>
        matchBody(body, {
          ConsentDetail: consentDetail,
          ver: "2.0.0",
          txnid: uuid,
        }) as any,
    )
    .reply(
      200,
      {
        ver: "2.0.0",
        timestamp: dateTime,
        txnid: uuid,
        Customer: {
          id: "9999999999@AA_identifier",
        },
        ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
      },
      {
        "x-jws-signature": signature,
      },
    )
    .post(
      "/Consent",
      (body) =>
        matchBody(body, {
          ConsentDetail: Object.assign({}, consentDetail, {
            consentMode: "STORE",
          }),
          ver: "2.0.0",
          txnid: uuid,
        }) as any,
    )
    .reply(400, {
      ver: "2.0.0",
      txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
      timestamp: "2023-06-26T11:33:34.509Z",
      errorCode: "InvalidRequest",
      errorMsg: "Error code specific error message",
    })
    .post(
      "/Consent/handle",
      (body) =>
        matchBody(body, {
          ver: "2.0.0",
          txnid: uuid,
          ConsentHandle: uuid,
        }) as any,
    )
    .reply(
      200,
      {
        ver: "2.0.0",
        timestamp: "2023-06-26T11:39:57.153Z",
        txnid: "795038d3-86fb-4d3a-a681-2d39e8f4fc3c",
        ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
        ConsentStatus: {
          id: "654024c8-29c8-11e8-8868-0289437bf331",
          status: "APPROVED",
        },
      },
      {
        "x-jws-signature": handleSignature,
      },
    )
    .post(
      "/Consent/handle",
      (body) =>
        matchBody(body, {
          ver: "2.0.0",
          txnid: uuid,
          ConsentHandle: "654024c8-bf331",
        }) as any,
    )
    .reply(400, {
      ver: "2.0.0",
      txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
      timestamp: "2023-06-26T11:33:34.509Z",
      errorCode: "InvalidRequest",
      errorMsg: "Error code specific error message",
    })
    .post(
      "/Consent/fetch",
      (body) =>
        matchBody(body, {
          ver: "2.0.0",
          txnid: uuid,
          consentId: uuid,
        }) as any,
    )
    .reply(
      200,
      {
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
      {
        "x-jws-signature": fetchSignature,
      },
    )
    .post(
      "/Consent/fetch",
      (body) =>
        matchBody(body, {
          ver: "2.0.0",
          txnid: uuid,
          consentId: "654024c8-bf331",
        }) as any,
    )
    .reply(400, {
      ver: "2.0.0",
      txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
      timestamp: "2023-06-26T11:33:34.509Z",
      errorCode: "InvalidRequest",
      errorMsg: "Error code specific error message",
    });
}
