interface ApiErrorProps {
  message: string;
  payload?: object;
  statusCode?: number;
}

export class ApiError extends Error {
  payload: object;
  statusCode: number;

  constructor({ message, payload = {}, statusCode = 400 }: ApiErrorProps) {
    super(message);
    this.payload = payload;
    this.statusCode = statusCode;
  }
}
