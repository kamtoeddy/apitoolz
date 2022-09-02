import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";
import { _getCallerFile } from "./utils/_getCallerFile.js";
import { join } from "path";

const loader =
  <T extends ObjectType>(modules: T, dirName: string) =>
  (name: keyof T) => {
    const _module = modules?.[name];

    if (!_module)
      throw new ApiError({
        message: "Unknown Circular module",
        payload: { [name]: "This module may is not registered" },
      });

    return require(join(dirName, _module));
  };

export function registerModules<T extends ObjectType>(modules: T) {
  return { loadCircular: loader(modules, _getCallerFile(2, true)) };
}

// try {
//   console.time("apiError");
//   const error = new ApiError({
//     message: "Unknown Circular module",
//     payload: { name: "This module may is not registered", add: "No adder" },
//   });

//   const values = ["pineapple", "elephant", "apple", "zebra", "antelope"];

//   for (const value of values) error.add(value, "this is " + value);

//   console.timeEnd("apiError");

//   throw error;
// } catch (err: any) {
//   console.time("err.summary");
//   console.log(err.summary);
//   console.timeEnd("err.summary");
// }
