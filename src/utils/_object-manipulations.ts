import { ObjectType } from "../interfaces";

const getKeys = (key: string | string[]) =>
  Array.isArray(key) ? key : key.split(".");

const hasProp = (obj: ObjectType | undefined = {}, prop = "") =>
  obj?.hasOwnProperty(prop);

export const deepCopy = (dt: any) => JSON.parse(JSON.stringify(dt));

export const assignDeep = (
  data: ObjectType,
  { key, value }: { key: string | string[]; value: any }
): ObjectType => {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key) return data;

  if (!key.length) {
    data[_key] = value;

    return data;
  }

  return { ...data, [_key]: assignDeep(data[_key], { key, value }) };
};

export const getDeepValue = (data: ObjectType, key: string): any => {
  return key.split(".").reduce((prev, next) => prev?.[next], data);
};

export const getSubObject = (obj: ObjectType, sampleSub: ObjectType) => {
  const _obj: ObjectType = {},
    keys = Object.keys(sampleSub);

  keys.forEach((key) => (_obj[key] = getDeepValue(obj, key)));

  return _obj;
};

export const hasDeepKey = (
  obj: ObjectType,
  key: string | string[]
): boolean => {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key || !obj) return false;

  const keyFound = hasProp(obj, _key);

  if (!keyFound && key.length) return false;

  if (keyFound && !key.length) return true;

  return hasDeepKey(obj?.[_key], key);
};

export const removeDeep = (
  obj: ObjectType,
  key: string | string[]
): ObjectType => {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key) return obj;

  if (!key.length) {
    delete obj[_key];
    return obj;
  }

  return { ...obj, [_key]: removeDeep(obj[_key], key) };
};

export const setDeepValue = (
  data: ObjectType,
  { key, value }: { key: string; value: any }
) => {
  return assignDeep(deepCopy(data), { key, value });
};
