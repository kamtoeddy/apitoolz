import { looseObject } from "../interfaces";

const getKeys = (key: string | string[]) =>
  Array.isArray(key) ? key : key.split(".");

const _has = (obj: looseObject | undefined = {}, key = "") =>
  obj?.hasOwnProperty(key);

export const deepCopy = (dt: any) => JSON.parse(JSON.stringify(dt));

export const assignDeep = (
  data: looseObject,
  { key, value }: { key: string | string[]; value: any }
): looseObject => {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key) return data;

  if (!key.length) {
    data[_key] = value;

    return data;
  }

  return { ...data, [_key]: assignDeep(data[_key], { key, value }) };
};

export const getDeepValue = (
  data: looseObject,
  { key }: { key: string }
): any => {
  return key.split(".").reduce((prev, next) => prev?.[next], data);
};

export const getSubObject = (obj: looseObject, sampleSub: looseObject) => {
  const _obj: looseObject = {},
    keys = Object.keys(sampleSub);

  keys.forEach((key) => (_obj[key] = getDeepValue(obj, { key })));

  return _obj;
};

export const hasDeepKey = (
  obj: looseObject,
  key: string | string[]
): boolean => {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key || !obj) return false;

  const keyFound = _has(obj, _key);

  if (!keyFound && key.length) return false;

  if (keyFound && !key.length) return true;

  return hasDeepKey(obj?.[_key], key);
};

export const removeDeep = (
  obj: looseObject,
  key: string | string[]
): looseObject => {
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
  data: looseObject,
  { key, value }: { key: string; value: any }
) => {
  return assignDeep(deepCopy(data), { key, value });
};
