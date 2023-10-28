import { ApiError } from './api-error';
import {
  FunctionDefinition,
  ObjectType,
  ParsedVariables,
  StringKey
} from './types';
import { ObjectDefinition, Primitive, VariableDefinitions } from './types';
import { isPropertyOf } from './utils/_object-tools';

function getDefault(val: Primitive | FunctionDefinition<any>) {
  return typeof val == 'function' ? val() : val;
}

function getDefinition(def: Primitive | ObjectDefinition): ObjectDefinition {
  return typeof def != 'object' ? { default: def } : def;
}

const processVariables = <T extends VariableDefinitions<T>>(vars: T) => {
  const error = new ApiError({
    message: 'Invalid Environment Variables',
    statusCode: 500
  });

  const parsedVars = {} as ParsedVariables<T>;

  const nameDefinitionTuples = Object.entries(vars) as [
    StringKey<T>,
    ObjectDefinition | Primitive
  ][];

  for (const [name, definition] of nameDefinitionTuples) {
    let isValid = true;

    const _name = name?.trim();

    if (!_name || name !== _name) {
      error.add(name, 'Should not be empty nor contain spaces');
      isValid = false;
    }

    const { default: _default, parser } = getDefinition(definition);

    if (isPropertyOf('parser', definition) && typeof parser != 'function') {
      error.add(name, 'A parser must be a function');
      isValid = false;
    }

    let val = process.env?.[name];

    if (isPropertyOf('required', definition)) {
      try {
        let required = (definition as ObjectDefinition).required;

        if (typeof required == 'function') required = required();

        if (required && !val) {
          error.add(name, `${name} is a required property`);
          isValid = false;
        }
      } finally {
        // pass
      }
    }

    if (!isValid) continue;

    if (val && parser) val = parser(val);

    parsedVars[name] = val ? val : getDefault(_default);
  }

  if (error.isPayloadLoaded) error.throw();

  return parsedVars;
};

type Options<T extends VariableDefinitions<T>, Output extends ObjectType> = {
  transform?: (variables: ParsedVariables<T>) => Output;
};
export const loadVariables = <
  T extends VariableDefinitions<T>,
  Output extends ObjectType = ParsedVariables<T>
>(
  vars: T,
  { transform }: Options<T, Output> = {}
) => {
  const parsed = processVariables(vars);

  return (transform ? transform(parsed) : parsed) as Output;
};
