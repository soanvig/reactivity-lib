import Dependency from './Dependency';
import watch from './watch';

describe('watch', () => {
  let mock;

  beforeEach(() => {
    mock = jest.fn();
  });

  it('should return function', () => {
    const result = watch(mock);
    expect(result).toBeInstanceOf(Function);
  });

  describe('returned function', () => {
    it('should call provided function', () => {
      const innerFunction = watch(mock);
      innerFunction();
      expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should save itself as activeFunction', () => {
      const innerFunction = watch(() => {
        expect(Dependency.activeFunction).toBe(innerFunction);
      });

      innerFunction();
    });

    it('should fallback activeFunction to null', () => {
      const innerFunction = watch(mock);
      innerFunction();
      expect(Dependency.activeFunction).toBe(null);
    });
  });

  describe('nested watched functions', () => {
    let inner;
    let outer;

    it('should keep activeFunctions order', () => {
      inner = watch(() => {
        expect(Dependency.activeFunction).toBe(inner);
      });
      outer = watch(() => {
        expect(Dependency.activeFunction).toBe(outer);
        inner();
        expect(Dependency.activeFunction).toBe(outer);
      });

      outer();
      expect(Dependency.activeFunction).toBe(null);
    });
  });
});