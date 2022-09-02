import { ApiError } from "./ApiError";

export interface IOptions {
  data: any;
  errorCode?: number;
  errorHandlers: Function[];
  headers: Record<string, any>;
  preTasks: Function[];
  postTasks: Function[];
  successCode?: number;
}

export type OnResultHandler = (data: any, success: boolean) => any;

async function useTasks(data: any, tasks: Function[]): Promise<any> {
  const task = tasks.shift();

  if (typeof task === "function") {
    const result = await task(data);
    return useTasks(result, tasks);
  }

  return data;
}

const makeResult = (
  data: any,
  success: boolean,
  onResult?: OnResultHandler
) => {
  return onResult ? onResult(data, success) : { data, success };
};

export async function makeController(
  controller: Function,
  {
    data = {},
    errorCode = 400,
    errorHandlers = [],
    headers = { "Content-Type": "application/json" },
    preTasks = [],
    postTasks = [],
    successCode = 200,
  }: IOptions,
  onResult?: OnResultHandler
) {
  try {
    if (preTasks?.length) data = await useTasks(data, preTasks);

    let body = await controller(data);

    if (postTasks?.length) body = await useTasks(body, postTasks);

    body = makeResult(body, true, onResult);

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
        await handler(data);
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
