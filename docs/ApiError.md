# ApiError

This is a custom error class you can use to tell your api clients what exactly when wrong with their request.

## Interface

```ts
interface ErrorSummary {
  _isError: true;
  message: string;
  payload: Record<string, string[]>;
  statusCode: number;
}

interface ApiError {
  message: string;
  payload: Record<string, string[]>;
  statusCode: number;
  add: (field: string, value?: string | string[]) => ApiError;
  clear: () => ApiError;
  getInfo: () => ErrorSummary;
  remove: (field: string) => ApiError;
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
