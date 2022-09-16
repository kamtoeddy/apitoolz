# loadVariables

This utility allows you to load, set default values & parse your environment variables so you can use directly in your application.

```js
const { loadVariables } = require("apitoolz");

const env = {
  DB_NAME: "test-db",
  ENV_NUMBER_VAL_PARSED: { parser: (v) => Number(v) },
  ENV_STRING_VAL: "",
  ETA: 20,
  IS_DEBUG_OPEN: false,
  MAX_TIME_TO_CANCEL: { default: 25, parser: (v) => v },
  TO_REJECT: { default: ["apple", "potato"] },
};

const {
  DB_NAME,
  ENV_STRING_VAL,
  ENV_NUMBER_VAL_PARSED,
  ETA,
  IS_DEBUG_OPEN,
  MAX_TIME_TO_CANCEL,
  TO_REJECT,
} = loadVariables(env);
```
