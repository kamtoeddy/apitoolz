export interface IFileConfig {
  maxSize?: number;
  pathOnly?: boolean;
}

export interface IFilesConfig {
  [key: string]: IFileConfig;
}

export type FilesConfigFx = (prop: any) => IFilesConfig;

export interface IParseMultipartDataConfig {
  filesConfig?: IFilesConfig;
  getFilesConfig?: FilesConfigFx;
  //   invalidFormats?: string[];
  maxSize?: number;
  pathOnly?: boolean;
  uploadDir: string;
  validFormats?: string[];
}
