# loadCircular

Use if you have circular dependencies. This utility registers you circular modules as key(`string`) - value(`string`) pairs. The key is the name of the module and the value is the relative path to the module.

It returns a function which takes in the name of the desired module and loads the module at runtime.

```js
const { registerModules } = require("apitoolz");

const loadCircular = registerModules({
  commentDb: "../comments/db.js",
  postDb: "../posts/db.js",
  userDb: "../users/db.js",
});

const commentDb = loadCircular("commentDb");

await commentDb.insert({ content: "Problem solved!" });

const postDb = loadCircular("postDb");
const userDb = loadCircular("userDb");
```
