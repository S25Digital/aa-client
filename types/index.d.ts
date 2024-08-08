import AAClient from "./client";

export * as ConsentTypes from "./consent";
export * as FITypes from "./fi";
export * from "./common";

export function createAAClient(privateKey: JWK, level?: "debug" | "error" = "error"): AAClient;
