# fileManager

To facilitate the use of multipart data & file management on the backend.

As of **v0.3.0**, the multipart parser:

- has to be configured with a response adapter and an onResult adapter. They're both optional just like the with `makeHandler` helper
- it supports the per file validFormats option in the file configuration or config setter
