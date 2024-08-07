import { JWK } from "jose";
import AAClient from "./client";
import axios from "axios";
import pino from "pino";

export type JWKKeyPair = JWK;

enum Levels {
  error = "error",
  debug = "debug",
}

export function createAAClient(
  privateKey: JWK,
  level: keyof typeof Levels = "error",
) {
  const logger = pino({
    level: level,
  });

  return new AAClient({
    privateKey,
    httpClient: axios,
    logger,
  });
}
