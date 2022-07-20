import { ApiError } from "../ApiError";
import { ILooseObject } from "../interfaces";

export const requireAuth =
  (authChecker: Function) =>
  async (req: ILooseObject, res: ILooseObject, next: Function) => {
    try {
      await authChecker(req);
    } catch (err: any) {
      return res.status(401).json(new ApiError(err).getInfo());
    }

    next();
  };
