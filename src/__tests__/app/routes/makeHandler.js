const router = require("express").Router();

const { makeHandler } = require("../libs");

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

module.exports = router;
