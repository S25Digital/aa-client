import { JWK } from "jose";
import AAClient from "./client";
import axios from "axios";
import pino from "pino";
import axiosRetry from "axios-retry";

export type JWKKeyPair = JWK;

enum Levels {
  error = "error",
  debug = "debug",
  silent = "silent",
}

const httpClient = axios.create();

axiosRetry(httpClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true,
  retryCondition: (error) => {
    return (
      error.code === "ECONNABORTED" ||
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error?.response?.status >= 500
    );
  },
});

export function createAAClient(
  privateKey: JWK,
  level: keyof typeof Levels = "silent",
) {
  const logger = pino({
    level: level,
  });

  return new AAClient({
    privateKey,
    httpClient: httpClient,
    logger,
  });
}
