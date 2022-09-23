import fs from "fs";
import { toArray } from "../utils/toArray";

export { parser as parseMultipartData } from "./parseMultipartData/parser";

const isExistingPath = (path: string) => {
  return fs.existsSync(path.substring(0, path.lastIndexOf("/")));
};

export function copyFile(from: string, to: string) {
  if (!isExistingPath(from)) return;

  if (!isExistingPath(to)) fs.mkdirSync(to, { recursive: true });

  fs.copyFileSync(from, to, fs.constants.COPYFILE_FICLONE);
}

export function cutFile(from: string, to: string) {
  try {
    copyFile(from, to);
    deleteFile(from);
  } catch (err: any) {
    console.error(err);
  }
}

export function deleteFile(path: string) {
  if (isExistingPath(path)) fs.unlinkSync(path);
}

export function deleteFilesAt(paths: string | string[] = []) {
  paths = toArray(paths);
  for (let path of paths) deleteFile(path);
}

export async function deleteFolder(path: string) {
  if (!isExistingPath(path)) return;
  return fs.rm(path, { recursive: true }, (err) => {
    if (err) console.log(`error deleting folder @${path}:`, err);
  });
}

export function getFileExtention(mimetype: string | null) {
  return String(mimetype).split("/")?.[1];
}

export function getFileName(path: string) {
  return path.substring(path.lastIndexOf("/") + 1);
}

export const getFilePath = (uploadDir: string) => (path: string) => {
  const uploadDirIndex = path.indexOf(uploadDir);

  return uploadDirIndex != -1
    ? path.substring(uploadDirIndex + uploadDir.length + 1)
    : path;
};

export function getFileType(mimetype: string) {
  return mimetype.split("/")[0];
}
