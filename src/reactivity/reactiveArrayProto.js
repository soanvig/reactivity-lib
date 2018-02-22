export const reactiveArrayProto = Object.create(Array.prototype);

// https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

methodsToPatch.forEach((method) => {
  const original = Array.prototype[method];
  reactiveArrayProto[method] = function (...args) {
    const result = original.apply(this, args);
    this.__dep__.notify();
    return result;
  };
});