import { ApiError } from "./ApiError";

interface options {
  data: any;
  errorHandlers: Function[];
  headers: object;
  preTasks: Function[];
  postTasks: Function[];
}

async function useTasks(data: any, tasks: Function[]): Promise<any> {
  const task = tasks.shift();

  if (typeof task === "function") {
    const result = await task(data);
    return useTasks(result, tasks);
  }

  return data;
}

export async function useController(
  controller: Function,
  {
    data = {},
    errorHandlers = [],
    headers = { "Content-Type": "application/json" },
    preTasks = [],
    postTasks = [],
  }: options
) {
  try {
    if (preTasks?.length) data = await useTasks(data, preTasks);

    let body = await controller(data);

    if (postTasks?.length) body = await useTasks(body, postTasks);

    return { body, headers, statusCode: 200 };
  } catch (err: any) {
    const body = new ApiError(err).getInfo();

    console.log("========== [ Log Start ] ==========");
    console.log(body);
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

    return { body, headers, statusCode: body.statusCode };
  }
}
