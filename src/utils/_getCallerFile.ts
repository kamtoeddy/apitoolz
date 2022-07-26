import path from "path";

const callsite = require("callsite");

export const _getCallerFile = (depth: number = 2, dirOnly = false) => {
  const stack = callsite();

  const filePath = stack?.[depth]?.getFileName();

  return dirOnly ? path.dirname(filePath) : filePath;
};
