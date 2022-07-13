import { looseObject } from "./interfaces";
import {
  assignDeep,
  getDeepValue,
  hasDeepKey,
} from "./utils/_object-manipulations";

interface ParseOption {
  parser?: (v: any) => any;
  type?: "boolean" | "number";
}

interface ParseOptions {
  [key: string]: ParseOption;
}

const getValByType = (value: any, type: "boolean" | "number") => {
  if (type === "number") return Number(value);

  return value === "false" ? false : true;
};

const parseKey = (reqSubset: looseObject, key: string, option: ParseOption) => {
  const { parser, type } = option;
  if (!parser && !type) return reqSubset;

  let value = getDeepValue(reqSubset, key);

  value = parser ? parser(value) : type ? getValByType(value, type) : value;

  return assignDeep(reqSubset, { key, value });
};

const parseKeys = (reqSubset: looseObject, options: ParseOptions) => {
  const keys = Object.keys(options).filter((key) => hasDeepKey(reqSubset, key));

  keys.forEach((key) => parseKey(reqSubset, key, options[key]));

  return reqSubset;
};

export const parseRequestKeys =
  (requestProp: string, options: ParseOptions = {}) =>
  (req: looseObject, res: looseObject, next: Function) => {
    if (!hasDeepKey(req, requestProp)) return next();

    let sub = getDeepValue(req, requestProp);

    assignDeep(req, { key: requestProp, value: parseKeys(sub, options) });

    next();
  };
