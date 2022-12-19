import { sortKeys } from "./utils/_object-tools";
import { toArray } from "./utils/toArray";
import {
  ApiErrorProps,
  ErrorPayload,
  ErrorSummaryProps,
  InputPayload,
  PayloadKey,
} from "./types";

export { ApiError, ErrorSummary };

class ErrorSummary extends Error {
  payload: ErrorPayload = {};
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ErrorSummaryProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }
}

class ApiError extends Error {
  private _statusCode: number;
  private _payload: ErrorPayload = {};
  private _initMessage: string;
  private _initStatusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this._initMessage = message;
    this._initStatusCode = this._statusCode = statusCode;
    this._setPayload(payload);
  }

  get isPayloadLoaded() {
    return Object.keys(this._payload).length > 0;
  }

  get statusCode() {
    return this._statusCode;
  }

  get summary() {
    return {
      message: this.message,
      payload: sortKeys(this._payload),
      statusCode: this._statusCode,
    };
  }

  private _has = (field: PayloadKey) => this._payload.hasOwnProperty(field);

  private _setPayload = (payload: InputPayload) => {
    Object.entries(payload).forEach(([key, value]) => this.add(key, value));
  };

  add(field: PayloadKey, value?: string | string[]) {
    if (value) {
      value = toArray(value);

      this._payload[field] = this._has(field)
        ? [...this._payload[field], ...value]
        : value;
    }

    return this;
  }

  remove = (field: PayloadKey) => {
    delete this._payload?.[field];
    return this;
  };

  reset = () => {
    this.message = this._initMessage;
    this._payload = {};
    this._statusCode = this._initStatusCode;

    return this;
  };

  setMessage = (message: string) => {
    this.message = message;
    return this;
  };

  setStatusCode = (code: number) => {
    this._statusCode = code;

    return this;
  };

  throw = () => {
    throw new ErrorSummary(this.summary);
  };
}
