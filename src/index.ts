import { JWK } from "jose";
import AAClient from "./client";
import axios from "axios";

export type JWKKeyPair = JWK;

export function createAAClient(privateKey: JWK){
  return new AAClient({
    privateKey,
    httpClient: axios
  });
}