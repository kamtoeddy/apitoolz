import { expressRequestAdapter } from "../adapters";
import { ApiError } from "../ApiError";
import { ObjectType, ResponseAdapter } from "../interfaces";
import { toArray } from "../utils/toArray";
import { getDeepValue } from "../utils/_object-tools";

export const makeRoleAuth =
  (
    roleExtractor: Function | string,
    message = "Access denied",
    adaptResponse: ResponseAdapter = expressRequestAdapter
  ) =>
  (roles: string | string[] = [], _roleExtractor?: Function | string) =>
  (req: ObjectType, res: ObjectType, next: Function) => {
    if (_roleExtractor) roleExtractor = _roleExtractor;

    const role: string =
      typeof roleExtractor === "function"
        ? roleExtractor(req)
        : getDeepValue(req, roleExtractor);

    if (!toArray(roles).includes(role)) {
      const statusCode = 403;

      return adaptResponse(res)
        .setStatusCode(statusCode)
        .end(new ApiError({ message, statusCode }).summary);
    }

    next();
  };
