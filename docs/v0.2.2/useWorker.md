# useWorker

To facilitate the use node's worker thread's with async/await. This helper passes data to a specified worker file most likely for a heavy computation.

It expects an object with 3 properties:

- `path` (string), that is; the relative path to the worker file
- `event` (string), that you could pass to your workers to identify the data sent or debugging purposes. It's optional
- `data` (any), any JSON serializable value you wish to pass to a worker file

Only the event & data would be passed to the worker file

```js
const { useWorker } = require("apitoolz");

const data = await useWorker({
  path: "./test-worker.js",
  data: { message: "data to process" },
});
```

The worker file:

```js
const { parentPort, workerData } = require("worker_threads");

(() => {
  let { event, data } = workerData;

  data = JSON.parse(data);

  data.isProcessed = true;

  parentPort.postMessage(data);
})();
```
