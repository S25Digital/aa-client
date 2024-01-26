import createMapper from "map-factory";
import { v4 } from "uuid";

export const baseMapper = createMapper();

baseMapper
  .set("ver", "2.0.0")
  .set("timestamp", () => new Date().toISOString())
  .set("txnid", () => v4());