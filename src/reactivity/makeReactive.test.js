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

  describe('array', () => {
    it('should proxy array', () => {
      const array = makeReactive([1, 2, 3]);
      const test = array[0];

      expect(dependMock).toHaveBeenCalledTimes(1);
    });
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