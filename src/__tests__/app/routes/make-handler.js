const router = require("express").Router();

const { makeHandler } = require("../libs");

// defaults
const defaultHandler = makeHandler();

router.get(
  "/defaults",
  defaultHandler((req) => ({ id: 1, name: "James" }))
);

router.get(
  "/defaults/error",
  defaultHandler((req) => {
    throw new Error("Invalid Operation");
  })
);

// custom
const customHandler = makeHandler(undefined, (data, success) => data);

router.get(
  "/custom",
  customHandler((req) => ({ id: 1, name: "James" }))
);

router.post(
  "/custom",
  customHandler((req) => req.body)
);

module.exports = router;
