# Parse Request Keys

Ever wanted to pass a boolean or numerical value in an HTTP GET `query` or `params` object? You can do way more with the `parseRequestKeys` function

Example:

```ts
import { parseRequestKeys } from "apitoolz";
import { myController } from "../controllers";

app.get(
  "/",
  parseRequestKeys({
    "params.someNumberToParse": { parser: customParser },
    query: {
      myBooleanField: "boolean",
      myNumberField: "number",
    },
  }),
  myController
);

function customParser(v: any) {
  return Number(v);
}
```

`parseRequestKeys` returns an Express.js like middleware that uses the configuration you precise to parse. You could also use a custom parser that accepts the value of the field as only parameter and should return the parsed value
