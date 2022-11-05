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

// ApiError
export type PayloadKey = number | string;

export type ErrorPayload = Record<PayloadKey, string[]>;
export type InputPayload = Record<PayloadKey, string | string[]>;

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
export type ObjectDefinition = { default?: any; parser?: (v: any) => any };
export type PrimitiveDefinition = boolean | number | string | symbol | Function;

export interface VariableDefinitions {
  [key: string]: PrimitiveDefinition | ObjectDefinition;
}

// makeHandler
export type CookieType = {
  key: string;
  value: string;
  options: ObjectType;
};

export type HeaderType = Record<string, number | string>;

export type ResponseAdapter = (response: ObjectType) => Adapter;
