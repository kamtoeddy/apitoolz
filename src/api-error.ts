import { isEqual, isPropertyOf, sortKeys } from './utils/_object-tools'
import { toArray } from './utils/to-array'
import {
  ApiErrorProps,
  ErrorPayload,
  ErrorSummaryProps,
  FieldError,
  InputPayload,
  PayloadKey
} from './types'

export { ApiError, ErrorSummary }

export type ValidationErrorToolProps = {
  message: string
  payload?: InputPayload
}

class ErrorSummary extends Error {
  payload: ErrorPayload = {}
  statusCode: number

  constructor({ message, payload = {}, statusCode = 400 }: ErrorSummaryProps) {
    super(message)
    this.payload = payload
    this.statusCode = statusCode
  }
}

class ApiError<OutputKeys extends PayloadKey = PayloadKey> extends Error {
  private _statusCode: number
  private _payload: ErrorPayload<OutputKeys> = {}
  private _initMessage: string
  private _initStatusCode: number

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message)
    this._initMessage = message
    this._initStatusCode = this._statusCode = statusCode
    this._setPayload(payload)
  }

  get isPayloadLoaded() {
    return Object.keys(this._payload).length > 0
  }

  get statusCode() {
    return this._statusCode
  }

  get summary() {
    return {
      message: this.message,
      payload: sortKeys(this._payload),
      statusCode: this._statusCode
    }
  }

  private _has = (field: OutputKeys) => isPropertyOf(field, this._payload)

  private _setPayload = (payload: InputPayload) => {
    if (payload)
      Object.entries(payload).forEach(([key, value]) =>
        this.add(key as OutputKeys, value)
      )
  }

  add(field: OutputKeys, value?: InputPayload[OutputKeys]) {
    const _value = makeFieldError(value ?? [])

    if (this._has(field)) {
      const currentValues = this._payload[field]!

      const { reasons = [], metadata } = _value

      reasons.forEach((reason) => {
        if (!currentValues.reasons.includes(reason))
          currentValues.reasons.push(reason)
      })

      if (metadata && !isEqual(currentValues.metadata, metadata))
        currentValues.metadata = {
          ...(currentValues?.metadata ?? {}),
          ...metadata
        }

      this._payload[field] = currentValues
    } else this._payload[field] = _value

    return this
  }

  remove = (field: OutputKeys) => {
    delete this._payload?.[field]

    return this
  }

  reset = () => {
    this.message = this._initMessage
    this._payload = {}
    this._statusCode = this._initStatusCode

    return this
  }

  setMessage = (message: string) => {
    this.message = message

    return this
  }

  setStatusCode = (code: number) => {
    this._statusCode = code

    return this
  }

  throw = () => {
    const summary = this.summary
    this.reset()

    throw new ErrorSummary(summary)
  }
}

function isFieldError(data: any): data is FieldError {
  return isPropertyOf('reasons', data) && isPropertyOf('metadata', data)
}

function makeFieldError(value: InputPayload[PayloadKey]): FieldError {
  return isFieldError(value)
    ? value
    : { reasons: toArray(value), metadata: null }
}
