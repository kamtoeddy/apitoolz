import { Request } from "express";
import { ApiError } from "./ApiError";
import { expressAdapter } from "./adapters";
import { NonEmptyArray, ObjectType, ResponseAdapter } from "./types";
import { toArray } from "./utils/toArray";

export interface IOptions {
  debug?: boolean;
  errorCode?: number;
  errorHandlers?: ControllerType | NonEmptyArray<ControllerType>;
  headers?: Record<string, any>;
  successCode?: number;
}

export type ControllerType = (request: Request) => any | Promise<any>;
export type OnResultHandler = (data: any, success: boolean) => any;

export const makeResult = (
  data: any,
  success: boolean,
  onResult?: OnResultHandler
) => {
  return onResult ? onResult(data, success) : { data, success };
};

const defaultControllerOptions = {
  debug: false,
  errorCode: 400,
  headers: { "Content-Type": "application/json" },
  successCode: 200,
};

async function makeController(
  controller: Function,
  req: Request,
  {
    debug,
    errorCode,
    errorHandlers,
    headers,
    successCode,
  }: IOptions = defaultControllerOptions,
  onResult?: OnResultHandler
) {
  try {
    const body = makeResult(await controller(req), true, onResult);

    return { body, headers, statusCode: successCode ?? 200 };
  } catch (err: any) {
    if (debug) {
      console.log("========== [ Log Start ] ==========");
      console.log(err);
      console.log("=========== [ Log End ] ===========");
    }

    for (let handler of toArray(errorHandlers)) {
      if (typeof handler !== "function") continue;

      try {
        await handler(req);
      } catch (err) {
        if (!debug) continue;

        console.log(
          `========= [ Error Handler @${handler?.name} crashed ] =========`
        );
        console.log(err);
        console.log("===================== [ Log End ] =====================");
      }
    }

    const body = makeResult(new ApiError(err).summary, false, onResult);

    return { body, headers, statusCode: errorCode ?? body.statusCode };
  }
}

export const makeHandler =
  (adapter: ResponseAdapter = expressAdapter, onResult?: OnResultHandler) =>
  (
    controller: ControllerType,
    options: IOptions = defaultControllerOptions
  ) => {
    return (req: Request, res: ObjectType) => {
      const response = adapter(res);

      makeController(controller, req, options, onResult)
        .then(({ body, headers, statusCode }: ObjectType) => {
          if (headers) response.setHeaders(headers);

          response.setStatusCode(statusCode ?? 200).end(body) as never;
        })
        .catch(({ message }: any) => {
          const statusCode = 500;

          const body = makeResult(
            { message: "Server Error", payload: {}, statusCode },
            false,
            onResult
          );

          console.log("========== [ Server Error ] ==========");
          console.log(new ApiError({ message, statusCode }).summary);
          console.log("============ [ Log End ] =============");

          response.setStatusCode(statusCode).end(body);
        });
    };
  };
