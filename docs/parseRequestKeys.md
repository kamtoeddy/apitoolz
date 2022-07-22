# Parse Request Keys

Ever wantend to pass a boolean or numerical value in an HTTP GET `query` or `params` object? With `apitoolz.parseRequestKeys` you can do way more.

```ts
import { parseRequestKeys } from "apitoolz";
import { myController } from "../controllers";

app.get(
  "/",
  parseRequestKeys({
    "params.someOtherFieldToParse": { parser: someOtherFieldParser },
    query: {
      myBooleanField: { type: "boolean" },
      myNumberField: { type: "number" },
    },
  }),
  myController
);
```

`parseRequestKeys` returns an Express.js like middleware that uses the configuration you precise to parse. You could also use a custom parser that accepts the value of the field as only parameter and should return the parsed value
