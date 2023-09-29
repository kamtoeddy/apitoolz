import { parentPort, workerData } from 'worker_threads'

;(() => {
  const data = JSON.parse(workerData)

  data.isProcessed = true

  parentPort.postMessage(data)
})()
