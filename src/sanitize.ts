import { DeepKeyOf, ObjectType } from './types';
import { toArray } from './utils/to-array';
import {
  assignDeep,
  cloneDeep,
  getDeepValue,
  hasDeepKey,
  removeDeep,
  removeEmpty
} from './utils/_object-tools';

type KeyType<T> = DeepKeyOf<T> | DeepKeyOf<T>[];
type ReplaceType<T> = { [K in DeepKeyOf<T>]?: string };
type SanitizedType<T> = T extends Array<infer U> ? U[] : T;
type SingleType<T> = T extends Array<infer U> ? U : T;

export namespace Sanitize {
  export interface Options<T> {
    remove?: KeyType<SingleType<T>>;
    replace?: ReplaceType<SingleType<T>>;
    select?: KeyType<SingleType<T>>;
  }
}

const defaultOptions = { remove: [], replace: {} };

const removeValues = <T extends ObjectType>(
  data: T,
  keysToRemove: KeyType<T>
) => {
  const _keysToRemove = toArray(keysToRemove);

  for (let key of _keysToRemove) removeDeep(data, key);

  return data;
};

const replaceValues = <T extends ObjectType>(
  data: T,
  keysToReplace: ReplaceType<T>
) => {
  const entries = Object.entries(keysToReplace) as [DeepKeyOf<T>, string][];

  for (let [key, newKey] of entries) {
    if (!hasDeepKey(data, key)) continue;

    assignDeep(data, newKey as DeepKeyOf<T>, getDeepValue(data, key));

    removeDeep(data, key);
    removeEmpty(data, key);
  }

  return data;
};

const selectValues = <T extends ObjectType>(
  data: T,
  keysToSelect: KeyType<T>
) => {
  const _keysToSelect = toArray(keysToSelect);

  const _data = {} as T;

  for (let key of _keysToSelect)
    if (hasDeepKey(data, key)) assignDeep(_data, key, getDeepValue(data, key));

  return _data;
};

const sortKeys = <T extends ObjectType>(data: T) => {
  const keys = Object.keys(data).sort((a, b) => (a < b ? -1 : 1));

  return keys.reduce((_data, next: keyof T) => {
    _data[next] = data[next];

    return _data;
  }, {} as T);
};

const one = <T extends ObjectType>(
  data: T,
  options: Sanitize.Options<T> = defaultOptions
) => {
  if (!data || typeof data != 'object') return data;

  let _data: any = data;

  const { remove, replace, select } = options;

  if (select?.length) _data = selectValues(_data, select as any);

  if (replace) _data = replaceValues(_data, replace);

  if (remove?.toLocaleString) _data = removeValues(_data, remove as any);

  return sortKeys(_data) as Partial<T>;
};

const many = <T extends ObjectType>(
  data: T[],
  options: Sanitize.Options<T> = defaultOptions
) => data.map((dt) => one(dt, options));

export const sanitize = <T extends ObjectType | ObjectType[]>(
  data: T,
  options: Sanitize.Options<T> = defaultOptions
) => {
  const { remove, replace, select } = options;

  if (!remove && !replace && !select) return data as SanitizedType<T>;

  const _data = cloneDeep(data);

  const sanitized = Array.isArray(_data)
    ? many(_data, options)
    : one(_data, options);

  return sanitized as SanitizedType<T>;
};
