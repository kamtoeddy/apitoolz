import fs from "fs";
import { asArray } from "../utils/asArray";

export { parser as parseMultipartData } from "./parseMultipartData/parser";

export function copyFile(from: string, to: string) {
  fs.copyFileSync(from, to, fs.constants.COPYFILE_FICLONE);
}

export function cutFile(from: string, to: string) {
  const dirFrom = from.substring(0, from.lastIndexOf("/"));
  const dirTo = to.substring(0, to.lastIndexOf("/"));

  if (!fs.existsSync(dirFrom)) return;

  if (!fs.existsSync(dirTo)) fs.mkdirSync(dirTo, { recursive: true });

  try {
    copyFile(from, to);
    deleteFile(from);
  } catch (err: any) {
    console.error(err.message);
  }
}

export function deleteFile(filePath: string) {
  fs.unlinkSync(filePath);
}

export function deleteFilesAt(paths: string | string[] = []) {
  paths = asArray(paths);
  for (let _path of paths) deleteFile(_path);
}

export async function deleteFolder(filePath: string) {
  return fs.rm(filePath, { recursive: true }, (err) =>
    err ? console.log(`error deleting folder, {${filePath}}:`, err) : null
  );
}

export function getFileExtention(mimetype: string | null) {
  return String(mimetype).split("/")?.[1];
}

export function getFileName(filePath: string) {
  return filePath.substring(filePath.lastIndexOf("/") + 1);
}

export function getFileType(mimetype: string) {
  return mimetype.split("/")[0];
}

export const makeFileSrc = (uploadDir: string) => (filePath: string) => {
  const uploadDirIndex = filePath.indexOf(uploadDir);
  if (uploadDirIndex != -1) {
    return filePath.substring(uploadDirIndex + uploadDir.length);
  }
  return filePath;
};
