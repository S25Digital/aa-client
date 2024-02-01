import nock from "nock";
import { IConstentDetail } from "../types/consent";

export const keyPair = {
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

export function setupNock() {
  return nock(baseUrl)
    .post("/Consent", {
      ConsentDetail: consentDetail,
      ver: "2.0.0",
      timestamp: dateTime,
      txnid: uuid,
    } as any)
    .reply(200, {
      ver: "2.0.0",
      timestamp: dateTime,
      txnid: uuid,
      Customer: {
        id: "9999999999@AA_identifier",
      },
      ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
    })
    .post("/Consent", {
      ConsentDetail: Object.assign({}, consentDetail, { consentMode: "STORE" }),
      ver: "2.0.0",
      timestamp: dateTime,
      txnid: uuid,
    } as any)
    .reply(400, {
      ver: "2.0.0",
      txnid: "0b811819-9044-4856-b0ee-8c88035f8858",
      timestamp: "2023-06-26T11:33:34.509Z",
      errorCode: "InvalidRequest",
      errorMsg: "Error code specific error message",
    })
    .post("/Consent/handle", {
      ver: "2.0.0",
      timestamp: dateTime,
      txnid: uuid,
      ConsentHandle: uuid,
    })
    .reply(200, {
      ver: "2.0.0",
      timestamp: "2023-06-26T11:39:57.153Z",
      txnid: "795038d3-86fb-4d3a-a681-2d39e8f4fc3c",
      ConsentHandle: "39e108fe-9243-11e8-b9f2-0256d88baae8",
      ConsentStatus: {
        id: "654024c8-29c8-11e8-8868-0289437bf331",
        status: "APPROVED",
      },
    })
    .post("/Consent/handle", {
      ver: "2.0.0",
      timestamp: dateTime,
      txnid: uuid,
      ConsentHandle: "654024c8-bf331",
    })
    .reply(400, {
      "ver": "2.0.0",
      "txnid": "0b811819-9044-4856-b0ee-8c88035f8858",
      "timestamp": "2023-06-26T11:33:34.509Z",
      "errorCode": "InvalidRequest",
      "errorMsg": "Error code specific error message"
    });
}
