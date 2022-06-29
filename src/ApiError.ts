interface ErrorPayload {
  [key: string]: string;
}

interface ApiErrorProps {
  message: string;
  payload?: ErrorPayload;
  statusCode?: number;
}

export class ApiError extends Error {
  __isError__: boolean = true;
  payload: object;
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }
}
