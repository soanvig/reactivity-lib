export function isPlainObject (obj) {
  return obj instanceof Object && obj.constructor === Object;
}

export function isArray (obj) {
  return obj instanceof Array;
}