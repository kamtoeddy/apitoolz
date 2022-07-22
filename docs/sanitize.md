# Sanitize Tool

A small tool to help you reshape the data to / from your clients.

## Some usecases

- Removing sensitive information from data pulled from a db before serving to clients
- Replacing fields on objects when they're transfered from service-to-service

```ts
import { sanitize } from "apitoolz";

async function getUserById(id: number | string) {
  const user = await db.findOne({ id });

  return sanitize.one(user, {
    replace: { id: "userId", remove: ["bankAccountDetails", "password"] },
  });
}
```

`sanitize.many` does the samething but expects an array as first argument and has the same options
