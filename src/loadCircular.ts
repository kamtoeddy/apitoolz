import { ApiError } from "./ApiError";
import { ILooseObject } from "./interfaces";
import { _getCallerFile } from "./utils/_getCallerFile.js";
import { join } from "path";

const loader =
  (modules: ILooseObject, dirName: string) =>
  (name: string = "") => {
    const _module = modules?.[name];

    if (!_module) throw new ApiError({ message: `${name} is not registered` });

    return require(join(dirName, _module));
  };

export const registerModules = (modules: ILooseObject) => {
  return { loadCircular: loader(modules, _getCallerFile(2, true)) };
};
