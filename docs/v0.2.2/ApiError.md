# ApiError

This is a custom error class you can use to tell your api clients what exactly when wrong with their request.

## Interface

```ts
interface ErrorSummary {
  message: string;
  payload: Record<string, string[]>;
  statusCode: number;
}

interface ApiError {
  message: string;
  payload: Record<number | string, string[]>;
  statusCode: number;
  add: (field: number | string, value?: string | string[]) => ApiError;
  clear: () => ApiError;
  getInfo: () => ErrorSummary;
  remove: (field: number | string) => ApiError;
  setMessage: (message: string) => ApiError;
}
```

## Example

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    password: [
      "should be between 8 and 30 characters long",
      "must have at least one number",
    ],
  },
  statusCode: 400,
});
```

## Properties

- ### summary

  This property is an object comprised of the message, payload & statusCode.

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    password: [
      "should be between 8 and 30 characters long",
      "must have at least one number",
    ],
  },
  statusCode: 400,
});

console.log(error.summary);
// {
//   message: "Validation Error",
//   payload: {
//     password: [
//       "should be between 8 and 30 characters long",
//       "must have at least one number",
//     ],
//   },
//   statusCode: 400,
// }
```

## Methods

- ### add

  This method is used to add a field + it's value(s) to the error's payload. If the field already exists, the new value(s) will just be appended.

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    password: [
      "invalid password",
      "should be between 8 and 30 characters long",
    ],
  },
  statusCode: 400,
});

error.add("email", "Invalid email");
error.add("password", "must have at least one number");
error.add("username", [
  "Invalid username",
  "Username cannot have special characters",
]);

console.log(error.summary);
// {
//   message: "Validation Error",
//   payload: {
//     eamil: ["Invalid email"],
//     password: [
//       "invalid password",
//       "should be between 8 and 30 characters long",
//       "must have at least one number",
//     ],
//     username: ["Invalid username", "Username cannot have special characters"],
//   },
//   statusCode: 400,
// }
```

- ### setMessage

  This method is used to change the error's message.

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    password: [
      "should be between 8 and 30 characters long",
      "must have at least one number",
    ],
  },
  statusCode: 400,
});

error.setMessage("Invalid Data");

console.log(error.summary);
// {
//   message: "Invalid Data",
//   payload: {
//     password: [
//       "should be between 8 and 30 characters long",
//       "must have at least one number",
//     ],
//   },
//   statusCode: 400,
// }
```

- ### remove

  This method removes a field from the error's payload.

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    eamil: ["Invalid email"],
    password: [
      "should be between 8 and 30 characters long",
      "must have at least one number",
    ],
  },
  statusCode: 400,
});

error.remove("email");

console.log(error.summary);
// {
//   message: "Validation Error",
//   payload: {
//     password: [
//       "should be between 8 and 30 characters long",
//       "must have at least one number",
//     ],
//   },
//   statusCode: 400,
// }
```

- ### reset

  This method restores the message & statusCode back to their initial values but empties the error's payload.

```ts
import { ApiError } from "apitoolz";

const error: ApiError = new ApiError({
  message: "Validation Error",
  payload: {
    email: ["Invalid email"],
    password: [
      "should be between 8 and 30 characters long",
      "must have at least one number",
    ],
  },
  statusCode: 400,
});

error.setMessage("Invalid Data");

error.reset();

console.log(error.summary);
// {
//   message: "Validation Error",
//   payload: { },
//   statusCode: 400,
// }
```

- ### throw

  This method throws the error's summary.
