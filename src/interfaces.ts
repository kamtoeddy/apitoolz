// type StringNumber = string | number;
// type Prev = [
//   never,
//   0,
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   10,
//   11,
//   12,
//   13,
//   14,
//   15,
//   16,
//   17,
//   18,
//   19,
//   20,
//   ...0[]
// ];

// type Join<K, P> = K extends StringNumber
//   ? P extends StringNumber
//     ? `${K}${"" extends P ? "" : "."}${P}`
//     : never
//   : never;

// type Paths<T, D extends number = 10> = [D] extends [never]
//   ? never
//   : T extends object
//   ? {
//       [K in keyof T]?: K extends StringNumber
//         ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
//         : never;
//     }[keyof T]
//   : "";

export type KeyOf<T> = Extract<keyof T, string> | string;

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
