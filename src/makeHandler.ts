import { ApiError } from "./ApiError";
import { expressRequestAdapter } from "./auth/adapters";
import { ControllerType, ObjectType, ResponseAdapter } from "./interfaces";

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
  (adaptResponse: ResponseAdapter = expressRequestAdapter) =>
  (controller: ControllerType) => {
    return (req: ObjectType, res: ObjectType) => {
      const response = adaptResponse(res);

      controller(adaptRequest(req))
        .then(({ body, cookies, headers, statusCode }: ObjectType) => {
          if (headers) response.setHeaders(headers);

          if (cookies) response.setCookies(cookies);

          response.setStatusCode(statusCode ?? 200).end(body) as never;
        })
        .catch(({ message }: Error) => {
          const statusCode = 500;

          response
            .setStatusCode(statusCode)
            .end(new ApiError({ message, statusCode }).getInfo());
        });
    };
  };
