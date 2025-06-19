import { expect } from "chai";
import { SinonFakeTimers, useFakeTimers} from "sinon";

import { buildRedirectURL } from "../src/redirectURL";

let clock: SinonFakeTimers;

describe("buildRedirectURL", () => {
    before(() => {
    clock = useFakeTimers(new Date());
  });
  after(() => {
    clock.restore();
  });
  const baseURL = "https://aa.xmpe.in";
  const testParams = {
    txnid: "txn-123",
    sessionid: "sess-456",
    srcref: ["ref-789"],
    userid: "9999999999@testaa",
    redirect: "https://example.com/callback",
    fi: "FIUID",
    secret: "ac12ghd75kf75r",
  };

  it("should generate a valid redirection object with URL, reqdate, ecreq and fi", () => {
    const result = buildRedirectURL(baseURL, testParams);

    expect(result).to.have.property("url").that.includes(baseURL);
    expect(result).to.have.property("reqdate").that.is.a("string").and.not
      .empty;
    expect(result).to.have.property("ecreq").that.is.a("string").and.not.empty;
    expect(result).to.have.property("fi").that.is.a("string").and.not.empty;
  });

  it("should include all expected query parameters", () => {
    const result = buildRedirectURL(baseURL, testParams);
    const url = new URL(result.url);

    expect(url.searchParams.get("reqdate")).to.equal(result.reqdate);
    expect(url.searchParams.get("ecreq")).to.equal(result.ecreq);
    expect(url.searchParams.get("fi")).to.equal(result.fi);
  });

  it("should generate different ecreq values with different salts", () => {
    const result1 = buildRedirectURL(baseURL, testParams);
    setTimeout(() => {
      const result2 = buildRedirectURL(baseURL, testParams);
      expect(result1.ecreq).to.not.equal(result2.ecreq);
    }, 1100); // Ensure salt differs by timestamp
  });

  it("should produce deterministic output if salt is fixed", () => {

    const r1 = buildRedirectURL(baseURL, testParams);
    const r2 = buildRedirectURL(baseURL, testParams);

    expect(r1.ecreq).to.equal(r2.ecreq);
    expect(r1.url).to.equal(r2.url);
  });
});
