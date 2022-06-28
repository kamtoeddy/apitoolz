import { ApiError } from "./ApiError";
import { looseObject } from "./interfaces";
import { isOfType } from "./utils/isOfType";

const getEnvVars = (vars: looseObject[] = [], defaults: looseObject = {}) => {
  let _vars: looseObject = {};

  vars.forEach(({ name, parser }) => {
    let val = process.env?.[name] ?? defaults?.[name];

    _vars[name] = parser ? parser(val) : val;
  });

  return _vars;
};

export const loadEnvVars = (
  vars: looseObject[],
  defaults: looseObject = {}
) => {
  const payload: looseObject = {};

  try {
    vars.forEach(({ name, parser }, i) => {
      payload[i] = [];
      if (!name?.trim()) payload[i].push("Invalid name");

      if (parser && !isOfType(parser, "function"))
        payload[i].push("Invalid parser");

      if (!payload[i].length) delete payload[i];
    });

    if (Object.keys(payload).length)
      throw new ApiError({
        message: "Invalid env vars",
        payload,
        statusCode: 500,
      });
  } catch (err) {
    console.log(err);
    return {};
  }

  return getEnvVars(vars, defaults);
};
