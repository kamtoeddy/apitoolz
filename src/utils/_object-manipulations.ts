import { ObjectType } from "../interfaces";

export {
  assignDeep,
  deepCopy,
  getDeepValue,
  hasDeepKey,
  removeDeep,
  removeEmpty,
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
function deepCopy(dt: any) {
  return dt === undefined ? dt : JSON.parse(JSON.stringify(dt));
}

function assignDeep(
  data: ObjectType,
  { key, value }: { key: string | string[]; value: any }
): ObjectType {
  key = getKeys(key);

  if (!key.length) return data;

  const _key = key.shift()!;

  if (!key.length) {
    data[_key] = value;

    return data;
  }

  if (!data?.[_key]) data[_key] = {};

  return { ...data, [_key]: assignDeep(data[_key], { key, value }) };
}

function getDeepValue(data: ObjectType, key: string): any {
  return key.split(".").reduce((prev, next) => prev?.[next], data);
}

function hasDeepKey(obj: ObjectType, key: string | string[]): boolean {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key || !obj) return false;

  const keyFound = hasProp(obj, _key);

  if (!keyFound && key.length) return false;

  if (keyFound && !key.length) return true;

  return hasDeepKey(obj?.[_key], key);
}

function removeDeep(obj: ObjectType, key: string | string[]): ObjectType {
  key = getKeys(key);

  if (!key.length) return obj;

  const _key = key.shift()!;

  if (!key.length) {
    delete obj?.[_key];
    return obj;
  }

  return { ...obj, [_key]: removeDeep(obj[_key], key) };
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
