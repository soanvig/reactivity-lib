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
    const origActiveFunction = Dependency.activeFunction;
    let activeFunctionSetMockCalls = [];

    beforeEach(() => {
      function activeFunctionSetMock () {
        activeFunctionSetMockCalls.push(arguments);
      }

      Object.defineProperty(Dependency, 'activeFunction', {
        get: jest.fn(),
        set: activeFunctionSetMock
      });
    });

    afterEach(() => {
      Dependency.activeFunction = origActiveFunction;
      activeFunctionSetMockCalls = [];
    });

    it('should call provided function', () => {
      const innerFunction = watch(mock);
      innerFunction();
      expect(mock).toHaveBeenCalledTimes(1);
    });

    it('should save itself as activeFunction', () => {
      const innerFunction = watch(mock);
      innerFunction();
      expect(activeFunctionSetMockCalls[0]).toContain(innerFunction);
    });

    it('should fallback activeFunction to null', () => {
      const innerFunction = watch(mock);
      innerFunction();
      expect(activeFunctionSetMockCalls[1]).toContain(null);
    });
  });
});