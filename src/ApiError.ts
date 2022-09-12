import { sortKeys } from "./utils/_object-tools";
import { toArray } from "./utils/toArray";

export type PayloadKey = number | string;

export type ErrorPayload = Record<PayloadKey, string[]>;
export type InputPayload = Record<PayloadKey, string | string[]>;

export interface ApiErrorProps {
  message: string;
  payload?: InputPayload;
  statusCode?: number;
}

export interface ErrorSummaryProps {
  message: string;
  payload: ErrorPayload;
  statusCode: number;
}

export class ErrorSummary extends Error {
  name = "ErrorSummary";
  payload: ErrorPayload = {};
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ErrorSummaryProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }
}
export class ApiError extends Error {
  name = "ApiError";
  payload: ErrorPayload = {};
  statusCode: number;
  private _initMessage: string;
  private _initStatusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this._initMessage = message;
    this._initStatusCode = this.statusCode = statusCode;
    this._setPayload(payload);
  }

  get isPayloadLoaded() {
    return Object.keys(this.payload).length > 0;
  }

  get summary() {
    return new ErrorSummary({
      message: this.message,
      payload: sortKeys(this.payload),
      statusCode: this.statusCode,
    });
  }

  private _has = (field: PayloadKey) => this.payload.hasOwnProperty(field);

  private _setPayload = (payload: InputPayload) => {
    Object.entries(payload).forEach(([key, value]) => {
      this.add(key, value);
    });
  };

  add(field: PayloadKey, value?: string | string[]) {
    if (value) {
      value = toArray(value);

      this.payload[field] = this._has(field)
        ? [...this.payload[field], ...value]
        : value;
    }

    return this;
  }

  remove = (field: PayloadKey) => {
    delete this.payload?.[field];
    return this;
  };

  reset = () => {
    this.message = this._initMessage;
    this.payload = {};
    this.statusCode = this._initStatusCode;

    return this;
  };

  setMessage = (message: string) => {
    this.message = message;
    return this;
  };
}
