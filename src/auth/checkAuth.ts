import { ApiError } from "../ApiError";
import { looseObject } from "../interfaces";

export const checkAuth =
  (authChecker: Function) =>
  async (req: looseObject, res: looseObject, next: Function) => {
    try {
      await authChecker(req);
    } catch (err: any) {
      return res.status(401).json(new ApiError(err).getInfo());
    }

    next();
  };
