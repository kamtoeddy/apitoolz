import { allowRoles } from "./allowRoles";
import { requireAuth } from "./requireAuth";

export const makeAuth = (
  authChecker: Function,
  roleExtractor: Function | string
) => {
  return {
    allowRoles: allowRoles(roleExtractor),
    requireAuth: requireAuth(authChecker),
  };
};
