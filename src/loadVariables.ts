import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";

// to be removed
export interface DefaultValues {
  [name: string]: any;
}

type ObjectDefinition = { default?: any; parser?: (v: any) => any };
type PrimitiveDefinition = boolean | number | string | symbol;

export interface VariableDefinitions {
  [key: string]: PrimitiveDefinition | ObjectDefinition;
}

type GetSimpleType<T> = T extends boolean ? boolean : T;
type GetNestedType<T, K extends keyof T> = GetSimpleType<T[K]>;
type GetType<T> = T extends ObjectType
  ? GetNestedType<T, "default">
  : GetSimpleType<T>;

type MappedObjectType<T> = {
  [K in keyof T]: GetType<T[K]>;
};

function getDefinition(
  def: PrimitiveDefinition | ObjectDefinition
): ObjectDefinition {
  return typeof def != "object" ? { default: def } : def;
}

export const loadVariables = <T extends VariableDefinitions>(vars: T) => {
  const error = new ApiError({
    message: "Invalid Environment Variables",
    statusCode: 500,
  });
  const parsedVars = {} as MappedObjectType<T>;

  try {
    const nameDefinitionTuples = Object.entries(vars);

    for (let [name, definition] of nameDefinitionTuples) {
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

      parsedVars[name as keyof T] = val ? val : _default;
    }

    if (error.isPayloadLoaded) throw error;
  } catch (err: any) {
    console.log(new ApiError(err).summary);
    return {} as MappedObjectType<T>;
  }

  return parsedVars;
};

const env = {
  DB_NAME: "test-deb",
  ETA: 20,
  IS_DEBUG_OPEN: false,
  MAX_TIME_TO_CANCEL: { parser: (v: any) => v, default: 25 },
  TO_REJECT: { default: ["apple", "potato"] },
};

const { DB_NAME, ETA, IS_DEBUG_OPEN, MAX_TIME_TO_CANCEL, TO_REJECT } =
  loadVariables(env);
