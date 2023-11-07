# CHANGELOG

# 0.3.20 <small><sup>07-11-2023</sup></small>

- [Update] update details provided in fileInfo of uploaded files

# 0.3.19 <small><sup>06-11-2023</sup></small>

- [Update] handle errors that may occur when dealing with `fileManager` util

# 0.3.18 <small><sup>05-11-2023</sup></small>

- [Update] improved typings of `loadVariables` utility

# 0.3.17 <small><sup>04-11-2023</sup></small>

- [Add] added transform option to `loadVariables` utility
- [Update] improved typings of `sanitize` utility

# 0.3.16 <small><sup>29-09-2023</sup></small>

- [Update] improved typings of `loadVariables`

# 0.3.15 <small><sup>29-09-2023</sup></small>

- [Update] updated signature of ApiError
- [Add] add `required` rule to env variable loader

# 0.3.14 <small><sup>27-02-2023</sup></small>

- [Update] made Paginator to cast 'limit' and 'page' options to numbers before manipulating

# 0.3.13 <small><sup>27-02-2023</sup></small>

- [Update] updated Paginator class

# 0.3.12 <small><sup>07-02-2023</sup></small>

- [Fix] fixed error when copying files to a new location with copyFile util in fileManager

# 0.3.11 <small><sup>25-12-2022</sup></small>

- [Update] disabled logging in console when there's an error deleting a folder with fileManager.deleteFolder

# 0.3.10 <small><sup>19-12-2022</sup></small>

- [Fix] error where copying a file to a non-existing directory created a folder with that file's name

# 0.3.9 <small><sup>24-11-2022</sup></small>

- [Fix] errorCode blocking runtime errorCode

# 0.3.8 <small><sup>18-11-2022</sup></small>

- [Fix] errorCode not working with makeHandler options when errorCode is not set

# 0.3.7 <small><sup>15-11-2022</sup></small>

- [Fix] typing errors of headers in makeHandler

# 0.3.6 <small><sup>08-11-2022</sup></small>

- [Fix] typing errors with the sanitize utility

# 0.3.5 <small><sup>08-11-2022</sup></small>

- [Update] typings with the sanitize utility

# 0.3.4 <small><sup>05-11-2022</sup></small>

- [Adde] possibility to pass a function(setter) for default values to variable loader
- [Updates] imporved performance

# 0.3.3 <small><sup>28-09-2022</sup></small>

- [Change] made server errors' logs in makeHandler non-optional

# 0.3.2 <small><sup>25-09-2022</sup></small>

- [Adde] added debug option to makeHandler

# 0.3.1 <small><sup>25-09-2022</sup></small>

- [Remove] removed callsite

# 0.3.0 <small><sup>22-09-2022</sup></small>

- [Adde] setStatusCode to ApiError and made the statusCode private
- [Update] enhanced default configs in file manager
- [Update] enhanced individual file configs in file manager
- [Update] the makeHandler can take one or more handlers
- [Update] improved on overall typings

# 0.2.2 <small><sup>16-09-2022</sup></small>

- [Docs] updated docs
- [Change] loadEnvVars to loadVariables
- [Change] makeCallback + makeController to makeHandler

# 0.2.1 <small><sup>09-08-2022</sup></small>

- [Remove] removed \_isError from ApiError
- [Change] changed default structure of body property in response object returned by useController to:

  ```ts
  body: {
    data: any;
    sucess: boolean;
  }
  ```

# 0.2.0 <small><sup>08-08-2022</sup></small>

- [Change] the sanitize object to a function
- [Remove] sanitize.one & sanitize.many
- [Adde] `select` option to sanitize

# 0.1.1 <small><sup>06-08-2022</sup></small>

- [Fix] variables without defaults being loaded

# 0.1.0 <small><sup>06-08-2022</sup></small>

- [Change] how loadEnvVars' default values are set

# 0.0.46 <small><sup>27-07-2022</sup></small>

- [Fix] multipartParser adding extra `/` between upload dir and file path

# 0.0.45 <small><sup>27-07-2022</sup></small>

- [Fix] multipartParser adding extra `/` between upload dir and file path
- [Fix] deprecation warnings from nodejs when deleting folders

# 0.0.44 <small><sup>27-07-2022</sup></small>

- [Docs] exported types for typescript support

# 0.0.43 <small><sup>26-07-2022</sup></small>

- [Fix] useWorker not resolving path properly

# 0.0.42 <small><sup>26-07-2022</sup></small>

- [Fix] useWorker not resolving path properly

# 0.0.41 <small><sup>26-07-2022</sup></small>

- [Change] Made path resolution of useWorker module to be relative to the caller file

# 0.0.40 <small><sup>22-07-2022</sup></small>

- [Docs] updated docs on ApiError, parseRequestKeys, sanitize, useController

# 0.0.39 <small><sup>20-07-2022</sup></small>

- [Adde] Helper parseMultipartData to parse form data
- [Adde] Some file manager utility functions

# 0.0.38 <small><sup>18-07-2022</sup></small>

- [Adde] onResult handler to useController so you could standardize your successful & unsuccessful responses from the useController.
- [Docs] Started work on documenting this package
