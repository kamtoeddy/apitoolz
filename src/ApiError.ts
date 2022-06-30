import { ApiErrorProps, ErrorPayload } from "./interfaces";

export class ApiError extends Error {
  name = "ApiError";
  payload: ErrorPayload;
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }

  add(field: string, value: string | string[]) {
    const toAdd = Array.isArray(value) ? [...value] : [value];

    if (!this.payload[field]) return (this.payload[field] = toAdd);

    this.payload[field] = [...this.payload[field], ...toAdd];
  }

  clear = () => (this.payload = {});

  getInfo = () => {
    return {
      _isError: true,
      message: this.message,
      payload: this.payload,
      statusCode: this.statusCode,
    };
  };

  remove = (field: string) => delete this.payload?.[field];

  setMessage = (message: string) => (this.message = message);
}
