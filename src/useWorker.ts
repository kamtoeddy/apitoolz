import { Worker } from "worker_threads";

import { ApiError } from "./ApiError";

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
  return new Promise((resolve, reject) => {
    const worker = new Worker(path, {
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
