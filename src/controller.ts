import { ApiError } from "./ApiError";
import { looseObject } from "./interfaces";

interface options {
  data: any;
  errorHandlers: Function[];
  headers: object;
  preTasks: Function[];
  postTasks: Function[];
}

async function useTasks(data: looseObject, tasks: Function[]) {
  let result: looseObject = data;

  for (let task of tasks) {
    if (typeof task !== "function") continue;

    const update = await task(result);

    result = { ...result, ...update };
  }

  return result;
}

export async function useController(
  controller: Function,
  {
    data = {},
    errorHandlers = [],
    headers = {
      "Content-Type": "application/json",
    },
    preTasks = [],
    postTasks = [],
  }: options
) {
  try {
    if (preTasks) data = { ...data, ...(await useTasks(data, preTasks)) };

    let body = await controller(data);

    if (postTasks) body = { ...body, ...(await useTasks(body, postTasks)) };

    return { body, headers, statusCode: 200 };
  } catch (err: any) {
    console.log("========== [ Log Start ] ==========");
    console.log(err);
    console.log("=========== [ Log End ] ===========");

    for (let handler of errorHandlers) {
      if (typeof handler !== "function") continue;

      try {
        await handler(data);
      } catch (handlerErr) {
        console.log(
          `========= [ Error Handler @${handler?.name} crashed ] =========`
        );
        console.log(handlerErr);
        console.log("===================== [ Log End ] =====================");
      }
    }

    const { message, payload, statusCode } = new ApiError(err);

    return {
      body: { message, payload },
      headers,
      statusCode,
    };
  }
}
