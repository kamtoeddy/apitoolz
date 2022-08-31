import { expressRequestAdapter } from "../adapters";
import { ResponseAdapter } from "../interfaces";
import { allowRoles } from "./allowRoles";
import { requireAuth } from "./requireAuth";

export const makeAuth = (
  authChecker: Function,
  roleExtractor: Function | string,
  adaptResponse: ResponseAdapter = expressRequestAdapter
) => {
  return {
    allowRoles: allowRoles(roleExtractor, adaptResponse),
    requireAuth: requireAuth(authChecker, adaptResponse),
  };
};
