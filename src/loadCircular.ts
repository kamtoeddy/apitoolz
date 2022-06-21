import { ApiError } from "./ApiError";
import { looseObject } from "./interfaces";

let _modules: looseObject = {};

export const loadCircular = (name: string = "") => {
  const _module = _modules?.[name];

  if (!_module) throw new ApiError({ message: `${name} is not registered` });

  return require(_module);
};

export const registerModules = (modules: looseObject) => (_modules = modules);
