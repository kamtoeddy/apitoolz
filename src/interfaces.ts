export interface ApiErrorProps {
  message: string;
  payload?: ErrorPayload;
  statusCode?: number;
}

export interface ErrorPayload {
  [key: string]: string[];
}

export type ILooseObject = {
  [key: string]: any;
};
