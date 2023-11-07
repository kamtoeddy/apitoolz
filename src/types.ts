import { type File } from 'formidable';

export { type File } from 'formidable';
export type ObjectType = Record<number | string, any>;
export type StringKey<T> = Extract<keyof T, string>;

export type KeyOf<T> = keyof T & (string | number);
export type NonEmptyArray<T> = [T, ...T[]];

export type DeepKeyOf<T> = T extends Function
  ? never
  : T extends ObjectType
  ? {
      [K in keyof T & (string | number)]: T[K] extends Array<any>
        ? K
        : T[K] extends ObjectType
        ? `${K}` | `${K}.${DeepKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : StringKey<T>;

export type DeepValueOf<
  T,
  P extends DeepKeyOf<T>
> = P extends `${infer K}.${infer Rest}`
  ? T[K & keyof T] extends infer S
    ? Rest extends DeepKeyOf<S>
      ? DeepValueOf<S, Rest>
      : never
    : never
  : T[P & keyof T];

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

export type FileInfo = Omit<File, 'filepath'> & { path: string };

export type FilesConfig = Record<string, FileConfig>;

export type ConfigSetter = (data: any) => FilesConfig;

export type ParserConfig = FileConfig & {
  filesConfig?: FilesConfig;
  getFilesConfig?: ConfigSetter;
  uploadDir?: string;
};

// loadVariables
type GetCallableType<D, Fallback = D> = D extends (...args: any) => any
  ? ReturnType<D>
  : Fallback;

type GetTypeOfObject<T> = T extends {
  default?: infer D;
  parser?: infer P;
}
  ? P extends NonNullable<Function>
    ? D extends NonNullable<D>
      ? GetCallableType<D> | GetCallableType<P>
      : GetCallableType<P> | undefined
    : GetCallableType<D>
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
  parser?: (v: string | undefined) => any;
  required?: boolean | (() => boolean);
};

export type VariableDefinitions<T> = {
  [K in StringKey<T>]: ObjectDefinition | (() => any) | any;
};

// makeHandler
export type CookieType = {
  key: string;
  value: string;
  options: ObjectType;
};

export type HeaderType = Record<string, number | string>;

export type ResponseAdapter = (response: ObjectType) => Adapter;
