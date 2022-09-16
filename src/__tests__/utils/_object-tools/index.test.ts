import {
  assignDeep_Tests,
  getDeepValue_Tests,
  hasDeepKey_Tests,
  removeDeep_Tests,
  removeEmpty_Tests,
} from ".";
import {
  assignDeep,
  getDeepValue,
  hasDeepKey,
  removeDeep,
  removeEmpty,
} from "../../../utils/_object-tools";

assignDeep_Tests({ assignDeep });
getDeepValue_Tests({ getDeepValue });
hasDeepKey_Tests({ hasDeepKey });
removeDeep_Tests({ removeDeep });
removeEmpty_Tests({ removeEmpty });
