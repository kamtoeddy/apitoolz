export type ObjectType = Record<number | string, any>;
export type StringKey<T> = Extract<keyof T, string>;

export type KeyOf<T> = keyof T & (string | number);
export type NonEmptyArray<T> = [T, ...T[]];

export type NestedKeyOf<T> = T extends never
  ? ''
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

// ApiError
export type PayloadKey = number | string;
export type FieldError = {
  reasons: string[];
  metadata: Record<PayloadKey, any> | null;
};
export type ErrorPayload<Keys extends PayloadKey = PayloadKey> = {
  [K in Keys]?: FieldError;
};
export type InputPayload = Record<PayloadKey, string | string[] | FieldError>;

export interface ApiErrorProps {
  message: string;
  payload?: InputPayload;
  statusCode?: number;
}

export interface ErrorSummaryProps {
  message: string;
  payload: ErrorPayload;
  statusCode: number;
}

// file manager
export type FileConfig = {
  maxSize?: number;
  pathOnly?: boolean;
  validFormats?: string[];
};

export type FilesConfig = Record<string, FileConfig>;

export type ConfigSetter = (data: any) => FilesConfig;

export type ParserConfig = FileConfig & {
  filesConfig?: FilesConfig;
  getFilesConfig?: ConfigSetter;
  uploadDir?: string;
};

// loadVariables
type GetCallableType<D, Fallback = D> = D extends () => infer R ? R : Fallback;

type GetTypeOfObject<T> = T extends {
  default?: infer D;
  parser?: infer P;
}
  ? P extends never
    ? D extends never
      ? never
      : GetCallableType<D>
    : D extends never
    ? GetCallableType<P>
    : GetCallableType<D> | GetCallableType<P>
  : never;

type GetType<T> = T extends { default?: any; parser?: any }
  ? GetTypeOfObject<T>
  : T extends () => infer R
  ? R
  : T;

export type ParsedVariables<T> = {
  [K in StringKey<T>]: GetType<T[K]>;
} & {};

export type FunctionDefinition<T> = () => T;
export type ObjectDefinition = {
  default?: any;
  parser?: (v: any) => any;
  required?: boolean | (() => boolean);
};
export type Primitive = boolean | number | string;

export type VariableDefinitions<T> = {
  [K in StringKey<T>]: Primitive | ObjectDefinition | (() => any);
};

// makeHandler
export type CookieType = {
  key: string;
  value: string;
  options: ObjectType;
};

export type HeaderType = Record<string, number | string>;

export type ResponseAdapter = (response: ObjectType) => Adapter;
