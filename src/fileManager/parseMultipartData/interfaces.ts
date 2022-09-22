export type FileConfig = {
  maxSize?: number;
  pathOnly?: boolean;
  validFormats?: string[];
};

export type IFilesConfig = Record<string, FileConfig>;

export type ConfigSetter = (data: any) => IFilesConfig;

export type ParserConfig = FileConfig & {
  filesConfig?: IFilesConfig;
  getFilesConfig?: ConfigSetter;
  uploadDir?: string;
};
