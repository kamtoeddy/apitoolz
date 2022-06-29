export interface ApiErrorProps {
  message: string;
  payload?: ErrorPayload;
  statusCode?: number;
}

export interface ErrorPayload {
  [key: string]: string[];
}

export type looseObject = {
  [key: string]: any;
};
