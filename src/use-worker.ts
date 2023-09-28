import { Worker } from 'worker_threads'
import { join } from 'path'

import { ApiError } from './api-error'
import { _getCallerFile } from './utils/_get-caller-file'

export interface useWorkerProps {
  data: any
  event?: string
  path: string
}

export const useWorker = ({ path = '', data }: useWorkerProps) => {
  const workerPath = join(_getCallerFile(2, true), path)
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: JSON.stringify(data)
    })

    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code: number) => {
      if (code !== 0) {
        reject(
          new ApiError({
            message: `Worker @${path} stopped executing with code ${code}`
          }).summary
        )
      }
    })
  })
}
