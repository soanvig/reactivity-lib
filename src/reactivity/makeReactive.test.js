import makeReactive from './makeReactive';
import Dependency from './Dependency';

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