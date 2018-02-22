/*
 * This function proxies array, fully preserving original behaviour,
 * adds notyfing method to array-mutating methods, and value setter.
 * adds depending method to getting array (which works even with forEach and map!)
 */

const mutatingMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

export default function proxyArray (originalArray, dependency) {
  return new Proxy(originalArray, {
    get (array, target) {
      // if required thing is mutating original method
      // we want to call notify, because array gets modified
      if (mutatingMethods.includes(target)) {
        return (...args) => {
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