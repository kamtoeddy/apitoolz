import { ApiError } from "./ApiError";
import { ObjectType } from "./interfaces";

export type HeaderType = Record<string, number | string>;

export interface AdaptedResponse {
  end: (body: any) => void;
  setCookies: (cookies: any[]) => void;
  setHeaders: (headers: HeaderType) => void;
  setStatusCode: (statusCode: number) => void;
}

export interface AdaptedRequest {
  body: ObjectType;
  ip: string;
  method: string;
  path: string;
  params: ObjectType;
  query: ObjectType;
  user: ObjectType | null;
  headers: {
    "Content-Type": string;
    referer: string;
    "User-Agent": string;
  };
}

export type ControllerType = (req: AdaptedRequest) => Promise<any>;

const adaptRequest = (req: ObjectType) => ({
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
});

export const makeHandler =
  (res: AdaptedResponse) => (controller: ControllerType) => {
    return (req: ObjectType) =>
      controller(adaptRequest(req))
        .then(({ body, cookies, headers, statusCode }: ObjectType) => {
          if (headers) res.setHeaders(headers);
          // if (Res.headers) res.set(Res.headers);

          if (cookies) res.setCookies(cookies);

          // if (Res.cookies)
          //   Res.cookies.forEach((cookie: ObjectType) => {
          //     res.cookie(cookie.key, cookie.value, cookie.options);
          //   });

          res.setStatusCode(statusCode ?? 200);
          res.end(body);

          // res.status(statusCode ?? 200).json(body);
        })
        .catch(({ message }: Error) => {
          const statusCode = 500;

          res.setStatusCode(statusCode);
          res.end(new ApiError({ message, statusCode }).getInfo());

          // res
          //   .status(statusCode)
          //   .send(new ApiError({ message, statusCode }).getInfo());
        });
  };
