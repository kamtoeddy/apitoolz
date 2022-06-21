import { looseObject } from "./interfaces";

type sanitizeOneOptions = {
  toReplace?: { [key: string]: string };
  toRemove?: string[];
};

const deepCopy = (dt: any) => JSON.parse(JSON.stringify(dt));

const one = (
  data: looseObject,
  { toReplace = {}, toRemove = ["_id"] }: sanitizeOneOptions = {
    toReplace: {},
    toRemove: [],
  }
) => {
  const keysToRepalce = Object.entries(toReplace ?? {});

  for (let [oldKey, key] of keysToRepalce) {
    data[key] = deepCopy(data[oldKey]);

    delete data[oldKey];
  }

  toRemove?.forEach((key) => delete data?.[key]);

  return data;
};

const many = (data: any[], { toReplace = {}, toRemove = ["_id"] }) => {
  const _data = [];

  for (let dt of data) _data.push(one(dt, { toReplace, toRemove }));

  return _data;
};

export const sanitize = { one, many };
