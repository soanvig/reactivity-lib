import makeReactive from './makeReactive';
import Dependency from './Dependency';

import * as helpers from '%/helpers';

describe('makeReactive', () => {
  let state;
  let dependMock;
  let notifyMock;

  beforeEach(() => {
    dependMock = Dependency.prototype.depend = jest.fn();
    notifyMock = Dependency.prototype.notify = jest.fn();
    state = {
      foo: null,
      bar: null
    };
    makeReactive(state);
  });

  it('should define getter and setter on each property', () => {
    const fooDescriptor = Object.getOwnPropertyDescriptor(state, 'foo');
    const barDescriptor = Object.getOwnPropertyDescriptor(state, 'bar');

    expect(fooDescriptor.get).toBeTruthy();
    expect(fooDescriptor.set).toBeTruthy();
    expect(barDescriptor.set).toBeTruthy();
    expect(barDescriptor.set).toBeTruthy();
  });

  describe('nested object', () => {
    beforeEach(() => {
      state = {
        foo: {
          bar: null
        }
      };

      makeReactive(state);
    });

    it('should have getter and setter on properties', () => {
      const descriptor = Object.getOwnPropertyDescriptor(state.foo, 'bar');

      expect(descriptor.get).toBeTruthy();
      expect(descriptor.set).toBeTruthy();
    });

    it('should not have getter and setter on itself', () => {
      const descriptor = Object.getOwnPropertyDescriptor(state, 'foo');

      expect(descriptor.get).toBeUndefined();
      expect(descriptor.set).toBeUndefined();
    });
  });

  describe('array', () => {
    // https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js
    // const methodsToPatch = [
    //   'push',
    //   'pop',
    //   'shift',
    //   'unshift',
    //   'splice',
    //   'sort',
    //   'reverse'
    // ]

    let array;

    beforeEach(() => {
      array = [1, 2, 3];
    });

    describe('push', () => {
      it('should preserve original behavior', () => {
        array.push(4);
        expect(array).toHaveLength(4);
      });

      it('should set & notify', () => {
        array.push(4);
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });

      it('should not notify if no argument', () => {
        array.push();
        expect(notifyMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('pop', () => {
      it('should preserve original behavior', () => {
        const result = array.pop();
        expect(result).toBe(3);
        expect(array).toHaveLength(2);
      });

      it('should set & notify', () => {
        array.pop();
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('shift', () => {
      it('should preserve original behavior', () => {
        const result = array.shift();
        expect(result).toBe(1);
        expect(array).toHaveLength(2);
      });

      it('should set & notify', () => {
        array.shift();
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('unshift', () => {
      it('should preserve original behavior', () => {
        const result = array.unshift(0);
        expect(result).toBe(4);
        expect(array[0]).toBe(0);
      });

      it('should set & notify', () => {
        array.unshift(0);
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });

      it('should not notify if no argument', () => {
        array.unshift();
        expect(notifyMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('splice', () => {
      it('should preserve original behavior', () => {
        const result = array.splice(0, 1);
        expect(result).toContain(1);
        expect(array).toHaveLength(2);
      });

      it('should set & notify', () => {
        array.splice(0, 1);
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('sort', () => {
      array = [3, 2, 1];

      it('should preserve original behavior', () => {
        array.sort();
        expect(array[0]).toBe(1);
      });

      it('should set & notify', () => {
        array.sort();
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('reverse', () => {
      it('should preserve original behavior', () => {
        array.reverse();
        expect(array[0]).toBe(3);
      });

      it('should set & notify', () => {
        array.reverse();
        expect(notifyMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getter', () => {
    it('should return object value', () => {
      expect(state.foo).toBeNull();
    });

    it('should call depend of dependency tracker', () => {
      expect(dependMock).toHaveBeenCalledTimes(0);
      const val = state.foo;
      expect(dependMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('setter', () => {
    it('should save new value', () => {
      state.foo = true;
      expect(state.foo).toBe(true);
    });

    it('should call notify of dependency tracker', () => {
      expect(notifyMock).toHaveBeenCalledTimes(0);
      state.foo = true;
      expect(notifyMock).toHaveBeenCalledTimes(1);
    });
  });
});