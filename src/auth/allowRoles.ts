import { ApiError } from "../ApiError";
import { ObjectType, ResponseAdapter } from "../interfaces";
import { toArray } from "../utils/toArray";
import { getDeepValue } from "../utils/_object-manipulations";

export const allowRoles =
  (roleExtractor: Function | string, adaptResponse: ResponseAdapter) =>
  (roles: string | string[] = [], _roleExtractor?: Function | string) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    if (_roleExtractor) roleExtractor = _roleExtractor;

    const role: string =
      typeof roleExtractor === "function"
        ? roleExtractor(req)
        : getDeepValue(req, roleExtractor);

    if (!toArray(roles).includes(role)) {
      adaptResponse(res)
        .setStatusCode(403)
        .end(new ApiError({ message: "Access denied" }).getInfo());
    }

    next();
  };
