import { ApiErrorProps, ErrorPayload } from "./interfaces";

type PayloadKey = number | string;

export class ApiError extends Error {
  name = "ApiError";
  payload: ErrorPayload;
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }

  private _has = (field: PayloadKey) => this.payload.hasOwnProperty(field);

  add(field: PayloadKey, value: string | string[]) {
    const toAdd = Array.isArray(value) ? [...value] : [value];

    this.payload[field] = this._has(field)
      ? [...this.payload[field], ...toAdd]
      : toAdd;

    return this;
  }

  clear = () => {
    this.payload = {};
    return this;
  };

  getInfo = () => {
    return {
      _isError: true,
      message: this.message,
      payload: this.payload,
      statusCode: this.statusCode,
    };
  };

  remove = (field: PayloadKey) => {
    delete this.payload?.[field];
    return this;
  };

  setMessage = (message: string) => {
    this.message = message;
    return this;
  };
}
