import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";
import { isOfType } from "./utils/isOfType";

export interface DefaultValues {
  [name: string]: any;
}

export interface VarDefinition {
  default?: any;
  name: string;
  parser?: Function;
}

const getEnvVars = (vars: VarDefinition[] = []) => {
  return vars.reduce((prev, { default: _default, name, parser }) => {
    let val = process.env?.[name];

    if (val && parser) val = parser(val);
    else val = _default;

    prev[name] = val;

    return prev;
  }, {} as ObjectType);
};

export const loadEnvVars = (vars: VarDefinition[]) => {
  const error = new ApiError({ message: "Invalid env vars", statusCode: 500 });

  try {
    vars.forEach(({ name, parser }, i) => {
      if (!name?.trim()) error.add(i, "Invalid name");

      if (parser && !isOfType(parser, "function"))
        error.add(i, "Invalid parser");
    });

    if (error.isPayloadLoaded) throw error;
  } catch (err) {
    console.log(err);
    return {};
  }

  return getEnvVars(vars);
};
