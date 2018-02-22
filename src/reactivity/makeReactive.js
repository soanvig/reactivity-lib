import { isPlainObject, isArray } from '@/helpers';
import Dependency from './Dependency';
import proxyArray from './proxyArray';

export function traverseArray (array) {
  array.forEach((item, index) => {
    // eslint-disable-next-line no-use-before-define
    array[index] = makeReactive(item);
  });
}

// To make any value interactive, we need to define setter&getter
// To do that we use Object.defineProperty (ES5.1)
export function makeReactive (obj) {
  // if the object is not supported, it should just return itself
  if (!isArray(obj) && !isPlainObject(obj)) {
    return obj;
  }

  if (isArray(obj)) {
    const dependency = new Dependency();

    // create proxy on array, to track changes
    obj = proxyArray(obj, dependency);

    // traverse down array
    traverseArray(obj);

    return obj;
  }

  Object.keys(obj).forEach((key) => {
    // Traverse down each object
    if (isPlainObject(obj[key])) {
      makeReactive(obj[key]);

      // Return, because we don't want object to be reactive by itself
      return;
    }

    // Because of JS clousure anything declared here
    // will be applied only to that property.

    // Create new dependency tracker for that value
    const dep = new Dependency();

    // Save that value, because otherwise we wouldn't
    // be able to use it in getter and setter.
    let internalValue = obj[key];
    Object.defineProperty(obj, key, {
      get () {
        // Save dependency
        dep.depend();
        return internalValue;
      },
      set (newValue) {
        // Update value and call all dependent functions
        internalValue = newValue;
        dep.notify();
      }
    });
  });
}

export default makeReactive;