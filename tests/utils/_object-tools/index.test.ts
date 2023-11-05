import {
  assignDeep_Tests,
  getDeepValue_Tests,
  hasDeepKey_Tests,
  isEqual_Tests,
  removeDeep_Tests,
  removeEmpty_Tests
} from '.';
import {
  assignDeep,
  getDeepValue,
  hasDeepKey,
  isEqual,
  removeDeep,
  removeEmpty
} from '../../../src/utils/_object-tools';

assignDeep_Tests({ assignDeep });
getDeepValue_Tests({ getDeepValue });
hasDeepKey_Tests({ hasDeepKey });
removeDeep_Tests({ removeDeep });
removeEmpty_Tests({ removeEmpty });
isEqual_Tests({ isEqual });
