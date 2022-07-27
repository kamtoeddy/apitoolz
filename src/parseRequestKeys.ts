import { ILooseObject } from "./interfaces";
import {
  assignDeep,
  getDeepValue,
  hasDeepKey,
} from "./utils/_object-manipulations";

export interface ParseOption {
  parser?: (v: any) => any;
  type?: "boolean" | "number";
}

export interface ParseOptions {
  [key: string]: ParseOption;
}

export interface ParsePropsConfig {
  [key: string]: ParseOptions;
}

const getValByType = (value: any, type: "boolean" | "number") => {
  if (type === "number") return Number(value);

  return value === "false" ? false : true;
};

const parseKey = (
  reqSubset: ILooseObject,
  key: string,
  option: ParseOption
) => {
  const { parser, type } = option;
  if (!parser && !type) return reqSubset;

  let value = getDeepValue(reqSubset, key);

  value = parser ? parser(value) : type ? getValByType(value, type) : value;

  return assignDeep(reqSubset, { key, value });
};

const parseKeys = (reqSubset: ILooseObject, options: ParseOptions) => {
  const keys = Object.keys(options).filter((key) => hasDeepKey(reqSubset, key));

  keys.forEach((key) => parseKey(reqSubset, key, options[key]));

  return reqSubset;
};

export const parseRequestKeys =
  (propsConfig: ParsePropsConfig) =>
  (req: ILooseObject, res: ILooseObject, next: Function) => {
    const keys = Object.keys(propsConfig);

    for (let key of keys) {
      if (!hasDeepKey(req, key)) continue;

      let sub = getDeepValue(req, key);

      assignDeep(req, { key, value: parseKeys(sub, propsConfig[key]) });
    }

    next();
  };
