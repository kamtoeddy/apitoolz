import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";
import { isOfType } from "./utils/isOfType";

export interface DefaultValues {
  // to remove
  [name: string]: any;
}

type ObjectDefinition = { default?: any; parser?: Function };
type PrimitiveDefinition = boolean | number | string | symbol;

export interface VariableDefinitions {
  [key: string]: PrimitiveDefinition | ObjectDefinition;
}

type GetSimpleType<T> = T;
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

export const loadEnvVars = <T extends VariableDefinitions>(vars: T) => {
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

      if (parser && !isOfType(parser, "function")) {
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
    console.log(new ApiError(err).getInfo());
    return {} as MappedObjectType<T>;
  }

  return parsedVars;
};

const res = loadEnvVars({
  age: 20,
  isAdmin: false,
  name: "James",
  revnameiew: { default: "baba" },
  review: { parser: () => {}, default: 20 },
});

res.age;
res.isAdmin;
res.name;
res.revnameiew;
res.review;
