import fs from 'fs';
import { Request } from 'express';

import formidable from 'formidable';

import { deleteFilesAt, getFileExtention } from '.';
import { ApiError } from '../api-error';
import { Adapter, ObjectType, ResponseAdapter, KeyOf } from '../types';
import { isJSON } from '../utils/is-json';
import { assignDeep, getDeepValue, hasDeepKey } from '../utils/_object-tools';
// import { FileConfig, ParserConfig } from "../in";
import { expressAdapter } from '../adapters';
import { makeResult, OnResultHandler } from '../make-handler';
import { FileConfig, ParserConfig } from '../types';

const defaultConfig: ParserConfig = {
  filesConfig: {},
  maxSize: 5 * 1024 * 1024,
  pathOnly: true,
  uploadDir: 'public/static/temp-upload-dir',
  validFormats: []
};

const requiredConfigs = [
  'maxSize',
  'pathOnly',
  'validFormats'
] as KeyOf<FileConfig>[];

function makeFileConfig(config?: FileConfig, fallback: FileConfig = {}) {
  if (!config) return fallback;

  for (const key of requiredConfigs)
    if (!hasDeepKey(config, key))
      assignDeep(config, key, getDeepValue(fallback, key));

  return config;
}

function terminateOperation(
  error: ApiError,
  response: Adapter,
  onResult?: OnResultHandler
) {
  const body = makeResult(error.summary, false, onResult);
  response.setStatusCode(error.statusCode).end(body);
}

export const parser =
  (adapter: ResponseAdapter = expressAdapter, onResult?: OnResultHandler) =>
  (config: ParserConfig = defaultConfig) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    const response = adapter(res);

    const generalConfig = { ...defaultConfig, ...config };

    let { filesConfig, getFilesConfig, uploadDir } = generalConfig;

    const error = new ApiError({
      message: 'Invalid Upload directory',
      statusCode: 500
    });

    if (!uploadDir) return terminateOperation(error, response, onResult);

    if (!uploadDir.endsWith('/')) uploadDir += '/';

    // make specified upload directory if does not exist
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({ uploadDir });

    error.setMessage('File upload error').setStatusCode(400);

    form.parse(req as Request, (err, fields, files) => {
      if (err) return terminateOperation(error, response, onResult);

      for (let prop in fields)
        req.body[prop] = isJSON(fields[prop])
          ? JSON.parse(fields[prop] as string)
          : fields[prop];

      if (getFilesConfig) filesConfig = getFilesConfig(req.body);

      const desiredFields = Object.keys(filesConfig!);
      const paths = [];
      const unWantedPaths = [];

      for (let key in files) {
        const file = files[key] as formidable.File;

        if (!desiredFields.includes(key)) {
          unWantedPaths.push(file.filepath);
          paths.push(file.filepath);
          continue;
        }

        let { maxSize, pathOnly, validFormats } = makeFileConfig(
          filesConfig?.[key],
          generalConfig
        );

        const { filepath, newFilename, size } = file;

        const fileExtention = getFileExtention(file.mimetype);

        if (!validFormats) validFormats = [];

        validFormats = validFormats.map((format) => format?.toLowerCase());

        // file format validation check
        if (
          validFormats.length &&
          !validFormats.includes(fileExtention?.toLowerCase())
        )
          error.add(key, 'Invalid file format');

        // size validation check
        if (size > maxSize!) error.add(key, 'Maximum file size exceeded');

        const newPath = `${uploadDir}${newFilename}.${fileExtention}`;
        fs.renameSync(filepath, newPath);

        // add newPath in case of errors
        // it'd be deleted with all others
        paths.push(newPath);

        req.body[key] = pathOnly ? newPath : { path: newPath, size };
      }

      deleteFilesAt(unWantedPaths);

      if (error.isPayloadLoaded) {
        deleteFilesAt(paths);
        return terminateOperation(error, response, onResult);
      }

      next();
    });
  };
