const router = require("express").Router();

const { loadVariables } = require("../libs");

const env = {
  DB_NAME: "test-db",
  ENV_NUMBER_VAL_PARSED: { parser: (v) => Number(v) },
  ENV_STRING_VAL: "",
  ETA: 20,
  IS_DEBUG_OPEN: false,
  MAX_TIME_TO_CANCEL: { default: 25, parser: (v) => v },
  TEST_VAL: () => "test val",
  TEST_VAL_1: { default: () => "test-val 1" },
  TO_REJECT: { default: ["apple", "potato"] },
};

const {
  DB_NAME,
  ENV_STRING_VAL,
  ENV_NUMBER_VAL_PARSED,
  ETA,
  IS_DEBUG_OPEN,
  MAX_TIME_TO_CANCEL,
  TEST_VAL,
  TEST_VAL_1,
  TO_REJECT,
} = loadVariables(env);

router.get("/defaults", (req, res) => {
  res.json({ DB_NAME, ETA, IS_DEBUG_OPEN, TO_REJECT });
});

router.get("/defaults/by-setter", (req, res) => {
  res.json({ TEST_VAL, TEST_VAL_1 });
});

router.get("/defaults", (req, res) => {
  res.json({ DB_NAME, ETA, IS_DEBUG_OPEN, TO_REJECT });
});

router.get("/defaults/parsed", (req, res) => {
  res.json({ MAX_TIME_TO_CANCEL });
});

router.get("/env", (req, res) => {
  res.json({ ENV_STRING_VAL });
});

router.get("/env/parsed", (req, res) => {
  res.json({ ENV_NUMBER_VAL_PARSED });
});

module.exports = router;
