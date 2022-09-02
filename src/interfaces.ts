// route handlers
export interface AdaptedRequest {
  body: ObjectType;
  ip: string;
  method: string;
  path: string;
  params: ObjectType;
  query: ObjectType;
  user: ObjectType | null;
  headers: {
    "Content-Type": string;
    referer: string;
    "User-Agent": string;
  };
}

export interface AdaptedResponse {
  end: (body: any) => void;
  setCookies: (cookies: CookieType[]) => this;
  setHeaders: (headers: HeaderType) => this;
  setStatusCode: (statusCode: number) => this;
}

export type ControllerType = (request: AdaptedRequest) => Promise<any>;

export type CookieType = {
  key: string;
  value: string;
  options: ObjectType;
};

export type HeaderType = Record<string, number | string>;

export type ObjectType = Record<number | string, any>;

export type ResponseAdapter = (response: ObjectType) => AdaptedResponse;
