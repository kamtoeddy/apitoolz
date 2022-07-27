import { ApiError } from "./ApiError";

const defaultErrorMethod = () => {
  throw new ApiError({ message: "Access denied" });
};

export interface MethodMap {
  [key: string]: Function;
}

export const handleAs =
  (methods: MethodMap, errorMethod: Function = defaultErrorMethod) =>
  (key: string, data: any) => {
    const method = methods?.[key];

    return method ? method(data) : errorMethod();
  };
