import path from 'path';

export function _getCallerFile(depth = 2, dirOnly = false) {
  const stack = callsite() as any;

  const filePath = stack?.[depth]?.getFileName();

  return dirOnly ? path.dirname(filePath) : filePath;
}

function callsite() {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack!.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;

  return stack;
}
