import fs from 'fs';
import { dirname } from 'path';
import { toArray } from '../utils/to-array';

export { parser as parseMultipartData } from './parse-multipart-data';

export {
  copyFile,
  cutFile,
  deleteFile,
  deleteFilesAt,
  deleteFolder,
  getFileExtention,
  getFileName,
  getFilePath,
  getFileType
};

const isExistingPath = (path: string) => {
  return fs.existsSync(dirname(path));
};

function copyFile(from: string, to: string) {
  if (!isExistingPath(from)) return false;

  try {
    if (!isExistingPath(to)) fs.mkdirSync(dirname(to), { recursive: true });

    fs.copyFileSync(from, to, fs.constants.COPYFILE_FICLONE);

    return true;
  } catch (_) {
    return false;
  }
}

function cutFile(from: string, to: string) {
  try {
    copyFile(from, to);
    deleteFile(from);

    return true;
  } catch (_) {
    return false;
  }
}

function deleteFile(path: string) {
  try {
    if (isExistingPath(path)) fs.unlinkSync(path);

    return true;
  } catch (_) {
    return false;
  }
}

function deleteFilesAt(paths: string | string[] = []) {
  {
    paths = toArray(paths);
    for (const path of paths) deleteFile(path);
  }
}

function deleteFolder(path: string) {
  if (!isExistingPath(path)) return false;

  try {
    fs.rmSync(path, { recursive: true });

    return true;
  } catch (_) {
    return false;
  }
}

function getFileExtention(mimetype: string | null) {
  return String(mimetype).split('/')?.[1];
}

function getFileName(path: string) {
  return path.substring(path.lastIndexOf('/') + 1);
}

const getFilePath = (uploadDir: string) => (path: string) => {
  const uploadDirIndex = path.indexOf(uploadDir);

  return uploadDirIndex != -1
    ? path.substring(uploadDirIndex + uploadDir.length + 1)
    : path;
};

function getFileType(mimetype: string) {
  return mimetype.split('/')[0];
}
