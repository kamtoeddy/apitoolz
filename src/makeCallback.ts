import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";

export type ControllerType = (req: ObjectType) => Promise<any>;

export const makeCallback = (controller: ControllerType) => {
  return (req: ObjectType, res: ObjectType) => {
    const Req = {
      body: req.body,
      ip: req.ip,
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      user: req.user,
      headers: {
        "Content-Type": req.get("Content-Type"),
        referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
      },
    };

    controller(Req)
      .then((Res: ObjectType) => {
        if (Res.headers) res.set(Res.headers);

        if (Res.cookies) {
          Res.cookies.forEach((cookie: ObjectType) => {
            res.cookie(cookie.key, cookie.value, cookie.options);
          });
        }

        res.status(Res?.statusCode ?? 200).json(Res.body);
      })
      .catch(({ message }: Error) => {
        const statusCode = 500;
        res
          .status(statusCode)
          .send(new ApiError({ message, statusCode }).getInfo());
      });
  };
};
