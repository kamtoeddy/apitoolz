import { ApiError } from "./ApiError";
import { StringKey } from "./types";
import {
  ObjectDefinition,
  PrimitiveDefinition,
  VariableDefinitions,
} from "./types";

type GetType<T> = T extends { default: infer D }
  ? D extends undefined
    ? T
    : D extends () => infer R
    ? R
    : D
  : T extends { default: () => infer R }
  ? R
  : T extends { parser: () => infer R }
  ? R
  : T;

type ParsedVariables<T> = {
  [K in StringKey<T>]: GetType<T[K]>;
};

function getDefault(val: PrimitiveDefinition) {
  return typeof val == "function" ? val() : val;
}

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

    const _name = name?.trim();

    if (!_name || name !== _name) {
      error.add(name, "Should not be empty nor contain spaces");
      isInValid = true;
    }

    const { default: _default, parser } = getDefinition(definition);

    if (definition.hasOwnProperty("parser") && typeof parser != "function") {
      error.add(name, "A parser must be a function");
      isInValid = true;
    }

    if (isInValid) continue;

    let val = process.env?.[name];

    if (val && parser) val = parser(val);

    parsedVars[name] = val ? val : getDefault(_default);
  }

  if (error.isPayloadLoaded) error.throw();

  return parsedVars;
};

export const loadVariables = <T extends VariableDefinitions>(vars: T) => {
  return processVariables(vars);
};
