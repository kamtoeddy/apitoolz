import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";
import { _getCallerFile } from "./utils/_getCallerFile.js";
import { join } from "path";

const loader =
  <T extends ObjectType>(modules: T, dirName: string) =>
  (name: keyof T) => {
    const _module = modules?.[name]!;

    if (!_module)
      new ApiError({
        message: "Unknown Circular module",
        payload: { [name]: "This module is not registered" },
      }).throw();

    return require(join(dirName, _module));
  };

export function registerModules<T extends ObjectType>(modules: T) {
  return { loadCircular: loader(modules, _getCallerFile(2, true)) };
}
