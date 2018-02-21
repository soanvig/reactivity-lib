import Dependency from './Dependency';

// To make any value interactive, we need to define setter&getter
// To do that we use Object.defineProperty (ES5.1)
export default function makeReactive (obj) {
  Object.keys(obj).forEach((key) => {
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