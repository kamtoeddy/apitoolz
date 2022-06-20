import { ApiError } from "./ApiError";
import { looseObject } from "./interfaces";

const loader =
  (modules: looseObject) =>
  async (name: string = "") => {
    const _module = modules?.[name];

    if (!_module) throw new ApiError({ message: `${name} is not registered` });

    return import(_module);
  };

export const useCircularDependencies = (modules: looseObject) => {
  return { loadCircular: loader(modules) };
};
