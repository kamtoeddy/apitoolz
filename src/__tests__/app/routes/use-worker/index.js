const router = require("express").Router();

const { useWorker } = require("../../libs");

router.get("/", async (req, res) => {
  const data = await useWorker({
    path: "./test-worker.js",
    data: { message: "data to process" },
  });

  res.json(data);
});

module.exports = router;
