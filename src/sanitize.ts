import { looseObject } from "./interfaces";
import {
  assignDeep,
  getDeepValue,
  removeDeep,
} from "./utils/_object-manipulations";

type sanitizeOneOptions = {
  remove?: string[];
  replace?: { [key: string]: string };
};

const one = (
  data: looseObject,
  { remove = [], replace = {} }: sanitizeOneOptions = {
    remove: [],
    replace: {},
  }
) => {
  if (!data) return data;

  const keysToRepalce = Object.entries(replace ?? {});

  for (let [key, newKey] of keysToRepalce) {
    assignDeep(data, {
      keys: newKey.split("."),
      value: getDeepValue(data, { key }),
    });

    removeDeep(data, key);
  }

  remove?.forEach((key) => removeDeep(data, key));

  return data;
};

const many = (data: any[], { remove = [], replace = {} }) => {
  const _data = [];

  for (let dt of data) _data.push(one(dt, { remove, replace }));

  return _data;
};

export const sanitize = { one, many };
