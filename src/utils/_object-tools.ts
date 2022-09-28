import { NestedKeyOf, ObjectType } from "../types";

export {
  assignDeep,
  cloneDeep,
  getDeepValue,
  hasDeepKey,
  removeDeep,
  removeEmpty,
  sortKeys,
};

const getKey = (key: string | string[]) =>
  Array.isArray(key) ? key.join(".") : key;

const getKeys = (key: string | string[]) =>
  Array.isArray(key) ? key : key.split(".");

const hasProp = (obj: ObjectType | undefined = {}, prop = "") =>
  obj?.hasOwnProperty(prop);

const isEmptyObject = (obj: ObjectType) =>
  obj === undefined || !Object.keys(obj).length;

// methods
function cloneDeep<T>(dt: T): T {
  return dt === undefined ? dt : JSON.parse(JSON.stringify(dt));
}

function _assignDeep<T extends ObjectType>(
  data: T,
  key: NestedKeyOf<T> | string[],
  value: any
): ObjectType {
  key = getKeys(key);

  const _key = key.shift()! as keyof T;

  if (!_key) return data;

  if (!key.length) {
    data[_key] = value;

    return data;
  }

  if (!data?.[_key]) data[_key] = {} as any;

  return { ...data, [_key]: _assignDeep(data[_key], key, value) };
}

function assignDeep<T extends ObjectType>(
  data: T,
  key: NestedKeyOf<T>,
  value: any
): ObjectType {
  return _assignDeep(data, key, value);
}

function getDeepValue<T extends ObjectType>(data: T, key: NestedKeyOf<T>): any {
  return key.split(".").reduce((prev, next) => prev?.[next], data);
}

function _hasDeepKey<T extends ObjectType>(
  obj: T,
  key: NestedKeyOf<T> | string[]
): boolean {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key || !obj) return false;

  const keyFound = hasProp(obj, _key);

  if (!keyFound && key.length) return false;

  if (keyFound && !key.length) return true;

  return _hasDeepKey(obj?.[_key], key);
}

function hasDeepKey<T extends ObjectType>(obj: T, key: NestedKeyOf<T>) {
  return _hasDeepKey(obj, key);
}

function _removeDeep<T extends ObjectType>(
  obj: T,
  key: string | string[]
): ObjectType {
  key = getKeys(key);

  const _key = key.shift()!;

  if (!_key) return obj;

  if (!key.length) {
    delete obj?.[_key];
    return obj;
  }

  return { ...obj, [_key]: _removeDeep(obj[_key], key) };
}

function removeDeep<T extends ObjectType>(obj: T, key: NestedKeyOf<T>) {
  return _removeDeep(obj, key);
}

function removeEmpty(obj: ObjectType, key: string | string[]): ObjectType {
  const currentKey = getKey(key);

  let deepValue = getDeepValue(obj, currentKey);

  if (isEmptyObject(deepValue)) {
    removeDeep(obj, currentKey);

    const keys = getKeys(currentKey);

    keys.pop();

    if (keys.length) return removeEmpty(obj, keys);
  }

  return obj;
}

function sortKeys<T extends ObjectType>(obj: T): T {
  const keys = Object.keys(obj).sort((a, b) => (a < b ? -1 : 1));

  return keys.reduce((prev, next: keyof T) => {
    prev[next] = obj[next];

    return prev;
  }, {} as T);
}
