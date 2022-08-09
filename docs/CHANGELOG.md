# Changelog of apitoolz

# 0.2.1 / 09-08-2022

- [Removed] removed \_isError from ApiError
- [Changed] changed default structure of body property in response object returned by useController to:

  ```ts
  body: {
    data: any;
    sucess: boolean;
  }
  ```

# 0.2.0 / 08-08-2022

- [Changed] the sanitize object to a function
- [Removed] sanitize.one & sanitize.many
- [Added] `select` option to sanitize

# 0.1.1 / 06-08-2022

- [Fix] variables without defaults being loaded

# 0.1.0 / 06-08-2022

- [Changed] how loadEnvVars' default values are set

# 0.0.46 / 27-07-2022

- [Fix] multipartParser adding extra `/` between upload dir and file path

# 0.0.45 / 27-07-2022

- [Fix] multipartParser adding extra `/` between upload dir and file path
- [Fix] deprecation warnings from nodejs when deleting folders

# 0.0.44 / 27-07-2022

- [Docs] exported types for typescript support

# 0.0.43 / 26-07-2022

- [Fix] useWorker not resolving path properly

# 0.0.42 / 26-07-2022

- [Fix] useWorker not resolving path properly

# 0.0.41 / 26-07-2022

- [Change] Made path resolution of useWorker module to be relative to the caller file

# 0.0.40 / 22-07-2022

- [Docs] updated docs on ApiError, parseRequestKeys, sanitize, useController

# 0.0.39 / 20-07-2022

- [Added] Helper parseMultipartData to parse form data
- [Added] Some file manager utility functions

# 0.0.38 / 18-07-2022

- [Added] onResult handler to useController so you could standardize your successful & unsuccessful responses from the useController. [Check it out](./v0.0.38/useController.md#onresult)
- [Docs] Started work on documenting this package