# useController

```ts
import { useController } from "apitoolz";

interface IOptions {
  data: any;
  errorCode?: number;
  errorHandlers?: Function[];
  headers: Record<string, any>;
  preTasks?: Function[];
  postTasks?: Function[];
  successCode?: number;
}

interface IControllerresponse {
  body: any;
  headers: Record<string, any>;
  statusCode: number;
}

type OnResultHandler = (data: any, success: boolean) => any;

interface I {
  useController: (
    task: Function,
    options: IOptions,
    onResult?: OnResultHandler
  ) => IControllerresponse;
}
```
