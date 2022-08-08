import { ObjectType } from "./interfaces";
import { asArray } from "./utils/asArray";
import {
  assignDeep,
  getDeepValue,
  hasDeepKey,
  removeDeep,
} from "./utils/_object-manipulations";

export type SanitizeOptions = {
  remove?: string | string[];
  replace?: { [key: string]: string };
  select?: string | string[];
};

const defaultOptions = { remove: [], replace: {} };

const removeValues = <T extends ObjectType>(
  data: T,
  keysToRemove: string | string[]
) => {
  keysToRemove = asArray(keysToRemove);

  for (let key of keysToRemove) removeDeep(data, key);

  return data;
};

const replaceValues = <T extends ObjectType>(
  data: T,
  keysToReplace: ObjectType
) => {
  for (let [key, newKey] of Object.entries(keysToReplace)) {
    if (!hasDeepKey(data, key)) continue;

    assignDeep(data, { key: newKey, value: getDeepValue(data, key) });

    removeDeep(data, key);
  }

  return data;
};

const selectValues = <T extends ObjectType>(
  data: T,
  keysToSelect: string | string[]
) => {
  keysToSelect = asArray(keysToSelect);

  const _data = {} as T;

  for (let key of keysToSelect) {
    if (hasDeepKey(data, key))
      assignDeep(_data, { key, value: getDeepValue(data, key) });
  }

  return _data;
};

const sortKeys = <T extends ObjectType>(data: T) => {
  const keys = Object.keys(data).sort((a, b) => (a < b ? -1 : 1));

  return keys.reduce((_data, next) => {
    _data[next as keyof T] = data[next];

    return _data;
  }, {} as T);
};

const one = <T>(data: T, options: SanitizeOptions = defaultOptions) => {
  if (!data) return data;

  let _data = data;

  const { remove, replace, select } = options;

  if (select?.length) _data = selectValues(_data, select);

  if (replace) _data = replaceValues(_data, replace);

  if (remove?.toLocaleString) _data = removeValues(_data, remove);

  return sortKeys(_data);
};

const many = <T extends ObjectType>(
  data: T[],
  options: SanitizeOptions = defaultOptions
) => data.map((dt) => one(dt, options));

export const sanitize = <T extends ObjectType>(
  data: T | T[],
  options: SanitizeOptions = defaultOptions
) => {
  const { remove, replace, select } = options;

  if (!remove && !replace && !select) return data;

  return Array.isArray(data) ? many(data, options) : one(data, options);
};
