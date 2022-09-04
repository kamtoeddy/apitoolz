import { KeyOf, ObjectType } from "./interfaces";
import { toArray } from "./utils/toArray";
import {
  assignDeep,
  cloneDeep,
  getDeepValue,
  hasDeepKey,
  removeDeep,
  removeEmpty,
} from "./utils/_object-tools";

type KeyType<T> = KeyOf<T> | KeyOf<T>[] | string[];
type ReplaceType<T> = { [K in KeyOf<T>]?: string };

export type SanitizeOptions<T> = {
  remove?: KeyType<T>;
  replace?: ReplaceType<T>;
  select?: KeyType<T>;
};

const defaultOptions = { remove: [], replace: {} };

const removeValues = <T extends ObjectType>(
  data: T,
  keysToRemove: KeyType<T>
) => {
  keysToRemove = toArray(keysToRemove);

  for (let key of keysToRemove) removeDeep(data, key);

  return data;
};

const replaceValues = <T extends ObjectType>(
  data: T,
  keysToReplace: ReplaceType<T>
) => {
  const entries = Object.entries(keysToReplace) as [KeyOf<T>, string][];

  for (let [key, newKey] of entries) {
    if (!hasDeepKey(data, key)) continue;

    assignDeep(data, { key: newKey, value: getDeepValue(data, key) });

    removeDeep(data, key);
    removeEmpty(data, key);
  }

  return data;
};

const selectValues = <T extends ObjectType>(
  data: T,
  keysToSelect: KeyType<T>
) => {
  keysToSelect = toArray(keysToSelect);

  const _data = {} as T;

  for (let key of keysToSelect) {
    if (hasDeepKey(data, key))
      assignDeep(_data, { key, value: getDeepValue(data, key) });
  }

  return _data;
};

const sortKeys = <T extends ObjectType>(data: T) => {
  const keys = Object.keys(data).sort((a, b) => (a < b ? -1 : 1));

  return keys.reduce((_data, next: keyof T) => {
    _data[next] = data[next];

    return _data;
  }, {} as T);
};

const one = <T>(data: T, options: SanitizeOptions<T> = defaultOptions) => {
  if (!data || typeof data != "object") return data;

  let _data: any = data;

  const { remove, replace, select } = options;

  if (select?.length) _data = selectValues(_data, select);

  if (replace) _data = replaceValues(_data, replace);

  if (remove?.toLocaleString) _data = removeValues(_data, remove);

  return sortKeys(_data) as Partial<T>;
};

const many = <T extends ObjectType>(
  data: T[],
  options: SanitizeOptions<T> = defaultOptions
) => data.map((dt) => one(dt, options));

export const sanitize = <T extends ObjectType>(
  data: T | T[],
  options: SanitizeOptions<T> = defaultOptions
) => {
  const { remove, replace, select } = options;

  if (!remove && !replace && !select) return data;

  const _data = cloneDeep(data);

  return Array.isArray(_data) ? many(_data, options) : one(_data, options);
};
