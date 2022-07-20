import { ApiError } from "./ApiError";
import { ILooseObject } from "./interfaces";
import { isOfType } from "./utils/isOfType";

interface DefaultValues {
  [name: string]: any;
}

interface VarDefinition {
  name: string;
  parser?: Function;
}

const getEnvVars = (
  vars: VarDefinition[] = [],
  defaults: DefaultValues = {}
) => {
  return vars.reduce((prev, { name, parser }) => {
    let val = process.env?.[name] ?? defaults?.[name];

    prev[name] = parser ? parser(val) : val;

    return prev;
  }, {} as ILooseObject);
};

export const loadEnvVars = (
  vars: VarDefinition[],
  defaults: DefaultValues = {}
) => {
  const error = new ApiError({ message: "Invalid env vars", statusCode: 500 });

  try {
    vars.forEach(({ name, parser }, i) => {
      if (!name?.trim()) error.add(i, "Invalid name");

      if (parser && !isOfType(parser, "function"))
        error.add(i, "Invalid parser");
    });

    if (Object.keys(error.payload).length) throw error;
  } catch (err) {
    console.log(err);
    return {};
  }

  return getEnvVars(vars, defaults);
};
