import { ApiError } from "../ApiError";
import { ObjectType } from "../interfaces";

export const requireAuth =
  (authChecker: Function) =>
  async (req: ObjectType, res: ObjectType, next: Function) => {
    try {
      await authChecker(req);
    } catch (err: any) {
      return res.status(401).json(new ApiError(err).getInfo());
    }

    next();
  };
