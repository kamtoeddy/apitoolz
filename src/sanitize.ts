import { looseObject } from "./interfaces";

type sanitizeOneOptions = {
  replace?: { [key: string]: string };
  remove?: string[];
};

const deepCopy = (dt: any) => JSON.parse(JSON.stringify(dt));

const one = (
  data: looseObject,
  { replace = {}, remove = ["_id"] }: sanitizeOneOptions = {
    replace: {},
    remove: [],
  }
) => {
  if (!data) return data;

  const keysToRepalce = Object.entries(replace ?? {});

  for (let [oldKey, key] of keysToRepalce) {
    data[key] = deepCopy(data[oldKey]);

    delete data[oldKey];
  }

  remove?.forEach((key) => delete data?.[key]);

  return data;
};

const many = (data: any[], { replace = {}, remove = ["_id"] }) => {
  const _data = [];

  for (let dt of data) _data.push(one(dt, { replace, remove }));

  return _data;
};

export const sanitize = { one, many };
