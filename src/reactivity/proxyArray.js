/*
 * This function proxies array, fully preserving original behaviour,
 * adds notyfing method to array-mutating methods, and value setter.
 * adds depending method to getting array (which works even with forEach and map!)
 */

import { traverseArray } from './makeReactive';

const mutatingMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

// istanbul ignore next
const inserted = {
  push: (args) => args,
  unshift: (args) => args,
  splice: (args) => args.slice(2)
};

export default function proxyArray (originalArray, dependency) {
  return new Proxy(originalArray, {
    get (array, target) {
      // Useful information about the Proxy
      if (target === '__proxy__') {
        return true;
      }

      // if required thing is mutating original method
      // we want to call notify, because array gets modified
      if (mutatingMethods.includes(target)) {
        return (...args) => {
          // because some methods may add something
          // we need to traverse these things
          const itemsInserted = inserted[target];
          if (itemsInserted) {
            traverseArray(itemsInserted(args));
          }

          const result = originalArray[target](...args);
          dependency.notify();
          return result;
        };
      }

      // if required thing is number, it means
      // that required is item from array
      if (!isNaN(target)) {
        // if is number
        dependency.depend();
        return originalArray[target];
      }

      // if it's not a number nor mutatingMethod
      // it has to be normal method
      if (originalArray[target]) {
        return originalArray[target];
      }

      // otherwise it's undefined
      return undefined;
    },

    set (array, target, value) {
      // if we are setting new item, we need to notify
      if (!isNaN(target)) {
        // if is number
        dependency.notify();
      }

      originalArray[target] = value;

      // required by proxy
      return value;
    }
  });
}