import { DeepKeyOf, DeepValueOf, ObjectType } from '../types';

export {
  assignDeep,
  cloneDeep,
  getDeepValue,
  hasDeepKey,
  isEqual,
  isPropertyOf,
  removeDeep,
  removeEmpty,
  sortKeys
};

const getKey = (key: string | string[]) =>
  Array.isArray(key) ? key.join('.') : key;

const getKeys = (key: string | string[]) =>
  Array.isArray(key) ? key : key.split('.');

const isEmptyObject = (obj: ObjectType) =>
  obj === undefined || !Object.keys(obj).length;

/**
 * tells whether `a` & `b` are equals
 * @param  depth how deep in nesting should equality checks be performed for objects
 */

function isEqual<T>(a: any, b: T, depth = 1): a is T {
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;

  let keysOfA = Object.keys(a),
    keysOfB = Object.keys(b as any);

  if (keysOfA.length != keysOfB.length) return false;
  (keysOfA = sort(keysOfA)), (keysOfB = sort(keysOfB));

  if (JSON.stringify(keysOfA) != JSON.stringify(keysOfB)) return false;

  if (depth > 0 && keysOfA.length)
    return keysOfA.every((key) => isEqual(a[key], (b as any)[key], depth - 1));

  return JSON.stringify(sortKeys(a)) == JSON.stringify(sortKeys(b as any));
}

function isPropertyOf<T>(
  prop: string | number | symbol,
  object: T
): prop is keyof T {
  return Object.hasOwnProperty.call(object, prop);
}

// methods

function cloneDeep<T>(dt: T): T {
  return dt === undefined ? dt : JSON.parse(JSON.stringify(dt));
}

function _assignDeep<T extends ObjectType>(
  data: T,
  key: DeepKeyOf<T> | string[],
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
  key: DeepKeyOf<T>,
  value: any
): ObjectType {
  return _assignDeep(data, key, value);
}

function getDeepValue<T extends ObjectType, K extends DeepKeyOf<T>>(
  data: T,
  key: K
): DeepValueOf<T, K> {
  return (key as any)
    .split('.')
    .reduce((prev: any, next: any) => prev?.[next], data);
}

function _hasDeepKey<T extends ObjectType>(
  obj: T,
  key: DeepKeyOf<T> | string[]
): boolean {
  key = getKeys(key);

  const _key = key.shift();

  if (!_key || !obj) return false;

  const keyFound = isPropertyOf(_key, obj);

  if (!keyFound && key.length) return false;

  if (keyFound && !key.length) return true;

  // @ts-ignore
  return _hasDeepKey(obj?.[_key], key);
}

function hasDeepKey<T extends ObjectType>(obj: T, key: DeepKeyOf<T>) {
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

function removeDeep<T extends ObjectType>(obj: T, key: DeepKeyOf<T>) {
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
  return sort(Object.keys(obj)).reduce((prev, next: keyof T) => {
    prev[next] = obj[next];

    return prev;
  }, {} as T);
}

function sort<T>(data: T[]): T[] {
  return data.sort((a, b) => (a < b ? -1 : 1));
}
