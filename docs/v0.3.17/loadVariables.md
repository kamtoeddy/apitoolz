# loadVariables

This utility allows you to load, set default values & parse your environment variables so you can use directly in your application.

```js
const { loadVariables } = require('apitoolz');

const config = {
  DB_NAME: 'test-db',
  ENV_NUMBER_VAL_PARSED: { parser: (v) => Number(v) },
  ENV_STRING_VAL: '',
  ETA: 20,
  IS_DEBUG_OPEN: false,
  MAX_TIME_TO_CANCEL: { default: 25, parser: (v) => v },
  TEST_VAL: () => 'test-value',
  TO_REJECT: { default: ['apple', 'potato'] }
};

const {
  DB_NAME,
  ENV_STRING_VAL,
  ENV_NUMBER_VAL_PARSED,
  ETA,
  IS_DEBUG_OPEN,
  MAX_TIME_TO_CANCEL,
  TEST_VAL,
  TO_REJECT
} = loadVariables(config);

// if you could transform them like this
const vars = loadVariables(config, {
  transform(envVars) {
    return { envVars, extraData: { here: true } };
  }
});

console.log(vars);
// {
//   envVars: {
//     DB_NAME,
//     ENV_STRING_VAL,
//     ENV_NUMBER_VAL_PARSED,
//     ETA,
//     IS_DEBUG_OPEN,
//     MAX_TIME_TO_CANCEL,
//     TEST_VAL,
//     TO_REJECT
//   },
//   extraData: { here: true }
// };
```