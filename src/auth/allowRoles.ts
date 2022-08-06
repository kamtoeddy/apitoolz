import { ApiError } from "../ApiError";
import { ObjectType } from "../interfaces";
import { getDeepValue } from "../utils/_object-manipulations";

export const allowRoles =
  (roleExtractor: Function | string = "user.role") =>
  (roles: string[] = [], _roleExtractor: Function | string) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    if (_roleExtractor) roleExtractor = _roleExtractor;

    const role: string =
      typeof roleExtractor === "function"
        ? roleExtractor(req)
        : getDeepValue(req, roleExtractor);

    if (!roles.includes(role)) {
      return res
        .status(403)
        .json(new ApiError({ message: "Access denied" }).getInfo());
    }

    next();
  };
