interface ErrorPayload {
  [key: string]: string[];
}

interface ApiErrorProps {
  message: string;
  payload?: ErrorPayload;
  statusCode?: number;
}

export class ApiError extends Error {
  _isError = true;
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

  remove = (field: string) => delete this.payload?.[field];
}
