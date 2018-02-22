export function listenOnValue (
  object,
  property,
  {
    get = () => {},
    set = () => {}
  }
) {
  const originalValue = object[property];
  object[`__${property}OriginalValue__`] = originalValue;

  let internalValue = originalValue;
  Object.defineProperty(object, property, {
    get () {
      get();
      return internalValue;
    },
    set (newValue) {
      internalValue = newValue;
      set(newValue);
    }
  });
}

export function revertListenOnValue (object, property) {
  Object.defineProperty(object, property, {
    value: object[`__${property}OriginalValue__`]
  });
}