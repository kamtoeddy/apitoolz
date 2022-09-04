# Sanitize Tool

A small tool to help you reshape the data to / from your clients.

## Some usecases

- Removing sensitive information from data pulled from a db before serving to clients
- Replacing fields on objects when they're transfered from service-to-service
- Selecting specific fields

```ts
import { sanitize } from "apitoolz";

async function getUserById(id: number | string) {
  const user = await db.findOne({ id });
  const users = await db.find({ isActive });

  const options = {
    replace: { id: "userId" },
    remove: ["bankAccountDetails", "password"],
  };

  const sanitizedUser = sanitize(user, options);
  const sanitizedUsers = sanitize(users, options);
}
```

## Options

```ts
interface ISanitizeOptions {
  replace?: Record<string, string>;
  remove?: string | string[];
  select?: string | string[];
}
```
