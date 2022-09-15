import { ApiError } from "./ApiError";
import { expressRequestAdapter } from "./adapters";
import { ObjectType, ResponseAdapter } from "./interfaces";

export interface IOptions {
  errorCode?: number;
  errorHandlers: Function[];
  headers: Record<string, any>;
  successCode?: number;
}

export type OnResultHandler = (data: any, success: boolean) => any;

const makeResult = (
  data: any,
  success: boolean,
  onResult?: OnResultHandler
) => {
  return onResult ? onResult(data, success) : { data, success };
};

const defaultControllerOptions = {
  errorCode: 400,
  errorHandlers: [],
  headers: { "Content-Type": "application/json" },
  successCode: 200,
};

async function makeController(
  controller: Function,
  req: ObjectType,
  onResult?: OnResultHandler,
  {
    errorCode,
    errorHandlers,
    headers,
    successCode,
  }: IOptions = defaultControllerOptions
) {
  try {
    const body = makeResult(await controller(req), true, onResult);

    return { body, headers, statusCode: successCode ?? 200 };
  } catch (err: any) {
    let body: any = new ApiError(err).summary;

    console.log("========== [ Log Start ] ==========");
    console.log(body);
    console.log(err);
    console.log("=========== [ Log End ] ===========");

    for (let handler of errorHandlers) {
      if (typeof handler !== "function") continue;

      try {
        await handler(req);
      } catch (err) {
        console.log(
          `========= [ Error Handler @${handler?.name} crashed ] =========`
        );
        console.log(err);
        console.log("===================== [ Log End ] =====================");
      }
    }

    body = makeResult(body, false, onResult);

    return { body, headers, statusCode: errorCode ?? body.statusCode };
  }
}

export const makeHandler =
  (adaptResponse: ResponseAdapter = expressRequestAdapter) =>
  (
    controller: Function,
    onResult?: OnResultHandler,
    options: IOptions = defaultControllerOptions
  ) => {
    return (req: ObjectType, res: ObjectType) => {
      const response = adaptResponse(res);

      makeController(controller, req, onResult, options)
        .then(({ body, headers, statusCode }: ObjectType) => {
          if (headers) response.setHeaders(headers);

          response.setStatusCode(statusCode ?? 200).end(body) as never;
        })
        .catch(({ message }: any) => {
          const statusCode = 500;

          response
            .setStatusCode(statusCode)
            .end(new ApiError({ message, statusCode }).summary);
        });
    };
  };
