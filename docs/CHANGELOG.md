# CHANGELOG

# 0.3.15 <small><sup>29-09-2023</sup></small>

- [Updated] update signature of ApiError
- [Add] add `required` rule to env variable loader

# 0.3.14 <small><sup>27-02-2023</sup></small>

- [Updated] made Paginator to cast 'limit' and 'page' options to numbers before manipulating

# 0.3.13 <small><sup>27-02-2023</sup></small>

- [Updated] updated Paginator class

# 0.3.12 <small><sup>07-02-2023</sup></small>

- [Fix] fixed error when copying files to a new location with copyFile util in fileManager

# 0.3.11 <small><sup>25-12-2022</sup></small>

- [Updated] disabled logging in console when there's an error deleting a folder with fileManager.deleteFolder

# 0.3.10 <small><sup>19-12-2022</sup></small>

- [Fixed] error where copying a file to a non-existing directory created a folder with that file's name

# 0.3.9 <small><sup>24-11-2022</sup></small>

- [Fixed] errorCode blocking runtime errorCode

# 0.3.8 <small><sup>18-11-2022</sup></small>

- [Fixed] errorCode not working with makeHandler options when errorCode is not set

# 0.3.7 <small><sup>15-11-2022</sup></small>

- [Fixed] typing errors of headers in makeHandler

# 0.3.6 <small><sup>08-11-2022</sup></small>

- [Fixed] typing errors with the sanitize utility

# 0.3.5 <small><sup>08-11-2022</sup></small>

- [Updated] typings with the sanitize utility

# 0.3.4 <small><sup>05-11-2022</sup></small>

- [Added] possibility to pass a function(setter) for default values to variable loader
- [Updates] imporved performance

# 0.3.3 <small><sup>28-09-2022</sup></small>

- [Changed] made server errors' logs in makeHandler non-optional

# 0.3.2 <small><sup>25-09-2022</sup></small>

- [Added] added debug option to makeHandler

# 0.3.1 <small><sup>25-09-2022</sup></small>

- [Removed] removed callsite

# 0.3.0 <small><sup>22-09-2022</sup></small>

- [Added] setStatusCode to ApiError and made the statusCode private
- [Updated] enhanced default configs in file manager
- [Updated] enhanced individual file configs in file manager
- [Updated] the makeHandler can take one or more handlers
- [Updated] improved on overall typings

# 0.2.2 <small><sup>16-09-2022</sup></small>

- [Docs] updated docs
- [Changed] loadEnvVars to loadVariables
- [Changed] makeCallback + makeController to makeHandler

# 0.2.1 <small><sup>09-08-2022</sup></small>

- [Removed] removed \_isError from ApiError
- [Changed] changed default structure of body property in response object returned by useController to:

  ```ts
  body: {
    data: any
    sucess: boolean
  }
  ```

# 0.2.0 <small><sup>08-08-2022</sup></small>

- [Changed] the sanitize object to a function
- [Removed] sanitize.one & sanitize.many
- [Added] `select` option to sanitize

# 0.1.1 <small><sup>06-08-2022</sup></small>

- [Fix] variables without defaults being loaded

# 0.1.0 <small><sup>06-08-2022</sup></small>

- [Changed] how loadEnvVars' default values are set

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

- [Added] Helper parseMultipartData to parse form data
- [Added] Some file manager utility functions

# 0.0.38 <small><sup>18-07-2022</sup></small>

- [Added] onResult handler to useController so you could standardize your successful & unsuccessful responses from the useController.
- [Docs] Started work on documenting this package
