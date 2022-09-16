import { ApiError } from "./ApiError";
import { StringKey } from "./interfaces";

type ObjectDefinition = { default?: any; parser?: (v: any) => any };
type PrimitiveDefinition = boolean | number | string | symbol;

export interface VariableDefinitions {
  [key: string]: PrimitiveDefinition | ObjectDefinition;
}

type GetType<T> = T extends { default: infer D }
  ? D extends undefined
    ? T
    : D
  : T extends { parser: () => infer R }
  ? R
  : T;

type ParsedVariables<T> = {
  [K in StringKey<T>]: GetType<T[K]>;
};

function getDefinition(
  def: PrimitiveDefinition | ObjectDefinition
): ObjectDefinition {
  return typeof def != "object" ? { default: def } : def;
}

const processVariables = <T extends VariableDefinitions>(vars: T) => {
  const error = new ApiError({
    message: "Invalid Environment Variables",
    statusCode: 500,
  });

  const parsedVars = {} as ParsedVariables<T>;

  const nameDefinitionTuples = Object.entries(vars) as [
    StringKey<T>,
    ObjectDefinition | PrimitiveDefinition
  ][];

  for (const [name, definition] of nameDefinitionTuples) {
    let isInValid = false;

    if (!name?.trim()) {
      error.add(name, "Invalid name");
      isInValid = true;
    }

    const { default: _default, parser } = getDefinition(definition);

    if (parser && typeof parser != "function") {
      error.add(name, "Invalid parser");
      isInValid = true;
    }

    if (isInValid) continue;

    let val = process.env?.[name];

    if (val && parser) val = parser(val);

    parsedVars[name] = val ? val : _default;
  }

  if (error.isPayloadLoaded) error.throw();

  return parsedVars;
};

export const loadVariables = <T extends VariableDefinitions>(vars: T) => {
  return processVariables(vars);
};
