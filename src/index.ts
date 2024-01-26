import { JWK } from "jose";
import AAClient from "./client";
import axios from "axios";

export * from "../types";

export function createAAClient(privateKey: JWK){
  return new AAClient({
    privateKey,
    httpClient: axios
  });
}

export * from "./cipher";