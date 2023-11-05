import fs from 'fs'
import { dirname } from 'path'
import { toArray } from '../utils/to-array'

export { parser as parseMultipartData } from './parse-multipart-data'

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
}

const isExistingPath = (path: string) => {
  return fs.existsSync(dirname(path))
}

function copyFile(from: string, to: string) {
  if (!isExistingPath(from)) return

  if (!isExistingPath(to)) fs.mkdirSync(dirname(to), { recursive: true })

  fs.copyFileSync(from, to, fs.constants.COPYFILE_FICLONE)
}

function cutFile(from: string, to: string) {
  try {
    copyFile(from, to)
    deleteFile(from)
  } catch (err: any) {
    console.error(err)
  }
}

function deleteFile(path: string) {
  if (isExistingPath(path)) fs.unlinkSync(path)
}

function deleteFilesAt(paths: string | string[] = []) {
  paths = toArray(paths)
  for (const path of paths) deleteFile(path)
}

async function deleteFolder(path: string) {
  if (!isExistingPath(path)) return
  
return fs.rm(path, { recursive: true }, () => {})
}

function getFileExtention(mimetype: string | null) {
  return String(mimetype).split('/')?.[1]
}

function getFileName(path: string) {
  return path.substring(path.lastIndexOf('/') + 1)
}

const getFilePath = (uploadDir: string) => (path: string) => {
  const uploadDirIndex = path.indexOf(uploadDir)

  return uploadDirIndex != -1
    ? path.substring(uploadDirIndex + uploadDir.length + 1)
    : path
}

function getFileType(mimetype: string) {
  return mimetype.split('/')[0]
}
