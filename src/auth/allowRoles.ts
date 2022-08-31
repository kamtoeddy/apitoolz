import { ApiError } from "../ApiError";
import { ObjectType, ResponseAdapter } from "../interfaces";
import { getDeepValue } from "../utils/_object-manipulations";
import { expressRequestAdapter } from "./adapters";

export const allowRoles =
  (
    adaptResponse: ResponseAdapter = expressRequestAdapter,
    roleExtractor: Function | string = "user.role"
  ) =>
  (roles: string[] = [], _roleExtractor: Function | string) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    if (_roleExtractor) roleExtractor = _roleExtractor;

    const role: string =
      typeof roleExtractor === "function"
        ? roleExtractor(req)
        : getDeepValue(req, roleExtractor);

    if (!roles.includes(role)) {
      adaptResponse(res)
        .setStatusCode(403)
        .end(new ApiError({ message: "Access denied" }).getInfo());
    }

    next();
  };
