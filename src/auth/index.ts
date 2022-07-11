import { allowRoles } from "./allowRoles";
import { checkAuth } from "./checkAuth";

export const makeAuth = (
  authChecker: Function,
  roleExtractor: Function | string
) => {
  return {
    allowRoles: allowRoles(roleExtractor),
    isAuth: checkAuth(authChecker),
  };
};
