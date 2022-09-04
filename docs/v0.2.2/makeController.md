# makeController

```ts
import { makeController } from "apitoolz";

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
  makeController: (
    task: Function,
    options: IOptions,
    onResult?: OnResultHandler
  ) => IControllerresponse;
}
```

## onResult (v0.0.38)

We now have the possibility to access our data both on success and on error in the useController via the `onResult`. This could be useful if you wanted to format your responses in a particular way before they got to your api clients.

The onResult callback takes 2 arguments, the data (response data / ApiError details) and the success status of the operation (a boolean). Anything returned from this function would be the the final result of your task

```javascript
function onResult(data, success) {
  // some logic here
  return { data, success };
}

app.get("/", makeCallback(makeController(task, options, onResult)));
```