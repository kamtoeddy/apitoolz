import { Worker } from "worker_threads";
import { join } from "path";

import { ApiError } from "./ApiError";
import { _getCallerFile } from "./utils/_getCallerFile";

interface useWorkerProps {
  data: any;
  event?: string;
  path: string;
}

export const useWorker = ({
  path = "",
  event = "handle-data",
  data,
}: useWorkerProps) => {
  const workerPath = join(_getCallerFile(2, true), path);
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: { event, data: JSON.stringify(data) },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code: number) => {
      if (code !== 0) {
        reject(
          new ApiError({
            message: `Worker stopped executing ${event} with code ${code}`,
          })
        );
      }
    });
  });
};
