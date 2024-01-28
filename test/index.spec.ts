import { expect } from "chai";

import { createAAClient } from "../src";
import { keyPair } from "./data";
import AAClient from "../src/client";

describe("The AA Client package", () => {
  describe("The create AA Client package", () => {
    it("should return aninstance of AAClient", () => {
      const client = createAAClient(keyPair);

      expect(client instanceof AAClient).to.be.true;
    });
  });
});
