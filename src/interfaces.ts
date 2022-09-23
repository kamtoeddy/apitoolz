export type ObjectType = Record<number | string, any>;
export type StringKey<T> = Extract<keyof T, string>;

export type KeyOf<T> = keyof T & (string | number);
export type NonEmptyArray<T> = [T, ...T[]];

export type NestedKeyOf<T> = T extends never
  ? ""
  : {
      [Key in KeyOf<T>]: T[Key] extends ObjectType
        ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
        : `${Key}`;
    }[KeyOf<T>];

export interface Adapter {
  end: (body: any) => void;
  setCookies: (cookies: CookieType[]) => this;
  setHeaders: (headers: HeaderType) => this;
  setStatusCode: (statusCode: number) => this;
}

export type CookieType = {
  key: string;
  value: string;
  options: ObjectType;
};

export type HeaderType = Record<string, number | string>;

export type ResponseAdapter = (response: ObjectType) => Adapter;
