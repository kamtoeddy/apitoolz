import { ObjectType } from "./types";
import { assignDeep, getDeepValue, hasDeepKey } from "./utils/_object-tools";

export type TypeParser = ((v: any) => any) | "boolean" | "number";

export type ParsePropsConfig = Record<
  string,
  TypeParser | Record<string, TypeParser>
>;

const getValByType = (value: any, type: "boolean" | "number") => {
  if (!["boolean", "number"].includes(type)) return value;

  if (type === "number") return Number(value);

  return value === "false" ? false : true;
};

const parseKey = (reqSubset: ObjectType, key: string, parser: TypeParser) => {
  let value = getDeepValue(reqSubset, key);

  value =
    typeof parser == "function" ? parser(value) : getValByType(value, parser);

  return assignDeep(reqSubset, key, value);
};

const parseKeys = (
  reqSubset: ObjectType,
  key: string,
  config: TypeParser | Record<string, TypeParser>
) => {
  if (typeof config != "object") {
    key = key.substring(key.indexOf(".") + 1);

    parseKey(reqSubset, key, config);

    return getDeepValue(reqSubset, key);
  }

  const keys = Object.keys(config).filter((key) => hasDeepKey(reqSubset, key));

  keys.forEach((key) => parseKey(reqSubset, key, config[key]));

  return reqSubset;
};

export const parseRequestKeys =
  (propsConfig: ParsePropsConfig) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    const keys = Object.keys(propsConfig);

    for (let key of keys) {
      if (!hasDeepKey(req, key)) continue;

      const config = propsConfig[key];

      const sub =
        typeof config == "object"
          ? getDeepValue(req, key)
          : req[key.substring(0, key.indexOf("."))];

      assignDeep(req, key, parseKeys(sub, key, config));
    }

    next();
  };
