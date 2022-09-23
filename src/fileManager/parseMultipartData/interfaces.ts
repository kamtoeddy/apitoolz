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
