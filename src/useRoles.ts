import { ApiError } from "./ApiError";

const defaultErrorMethod = () => {
  throw new ApiError({ message: "Access denied" });
};

interface MethodMap {
  [key: string]: Function;
}

export const useRoles =
  (methods: MethodMap, errorMethod: Function = defaultErrorMethod) =>
  (role: string, data: any) => {
    const method = methods?.[role];

    return method ? method(data) : errorMethod();
  };
