import { reqjson } from "./reqjson.js";
import { resjson, rescbor } from "./resjson.js";

export const handleAPI = async (req, path, func) => {
  const param = await reqjson(req);
  const ret = await func(param, req, path);
  const accept = req.headers.get("Accept");
  if (accept && accept.indexOf("application/cbor") >= 0) {
    return rescbor(ret);
  }
  return resjson(ret);
};
