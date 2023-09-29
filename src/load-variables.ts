import { ApiError } from './api-error'
import { StringKey } from './types'
import {
  ObjectDefinition,
  PrimitiveDefinition,
  VariableDefinitions
} from './types'
import { isPropertyOf } from './utils/_object-tools'

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
  : T

type ParsedVariables<T> = {
  [K in StringKey<T>]: GetType<T[K]>
} & {}

function getDefault(val: PrimitiveDefinition) {
  return typeof val == 'function' ? val() : val
}

function getDefinition(
  def: PrimitiveDefinition | ObjectDefinition
): ObjectDefinition {
  return typeof def != 'object' ? { default: def } : def
}

const processVariables = <T extends VariableDefinitions>(vars: T) => {
  const error = new ApiError({
    message: 'Invalid Environment Variables',
    statusCode: 500
  })

  const parsedVars = {} as ParsedVariables<T>

  const nameDefinitionTuples = Object.entries(vars) as [
    StringKey<T>,
    ObjectDefinition | PrimitiveDefinition
  ][]

  for (const [name, definition] of nameDefinitionTuples) {
    let isValid = true

    const _name = name?.trim()

    if (!_name || name !== _name) {
      error.add(name, 'Should not be empty nor contain spaces')
      isValid = false
    }

    const { default: _default, parser } = getDefinition(definition)

    if (isPropertyOf('parser', definition) && typeof parser != 'function') {
      error.add(name, 'A parser must be a function')
      isValid = false
    }

    let val = process.env?.[name]

    if (isPropertyOf('required', definition)) {
      try {
        let required = (definition as ObjectDefinition).required

        if (typeof required == 'function') required = required()

        if (required && !val) {
          error.add(name, `${name} is a required property`)
          isValid = false
        }
      } finally {
        // pass
      }
    }

    if (!isValid) continue

    if (val && parser) val = parser(val)

    parsedVars[name] = val ? val : getDefault(_default)
  }

  if (error.isPayloadLoaded) error.throw()

  return parsedVars
}

export const loadVariables = <T extends VariableDefinitions>(vars: T) => {
  return processVariables(vars)
}
