const { parentPort, workerData } = require("worker_threads");

(() => {
  let { data } = workerData;

  data = JSON.parse(data);

  //   let _data = []

  for (let dt of data) {
    dt.id = dt._id;
    delete dt._id;
    // _data.push(dt)
  }

  // handleData(data);

  //   console.log("data:", data);
  parentPort.postMessage(data);
})();
