import { JWK } from "jose";
import AAClient from "./client";
import axios from "axios";
import pino from "pino";

export type JWKKeyPair = JWK;

enum Levels {
  error = "error",
  debug = "debug",
  silent = "silent",
}

export function createAAClient(
  privateKey: JWK,
  level: keyof typeof Levels = "silent",
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
