import { expressRequestAdapter } from "../adapters";
import { ApiError } from "../ApiError";
import { ObjectType, ResponseAdapter } from "../interfaces";

export const makeRequireAuth =
  (
    authChecker: Function,
    adaptResponse: ResponseAdapter = expressRequestAdapter
  ) =>
  async (req: ObjectType, res: ObjectType, next: Function) => {
    try {
      await authChecker(req);
    } catch (err: any) {
      const statusCode = 401;

      return adaptResponse(res)
        .setStatusCode(statusCode)
        .end(new ApiError({ ...err, statusCode }).summary);
    }

    next();
  };
