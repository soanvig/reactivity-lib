import Dependency from './Dependency';
import proxyArray from './proxyArray';

describe('proxyArray', () => {
  let array;
  let originalDepend;
  let originalNotify;
  let mockDepend;
  let mockNotify;

  beforeEach(() => {
    array = [1, 2, 3];
    const dependency = new Dependency();
    array = proxyArray(array, dependency);

    originalDepend = Dependency.prototype.depend;
    originalNotify = Dependency.prototype.notify;
    mockDepend = Dependency.prototype.depend = jest.fn();
    mockNotify = Dependency.prototype.notify = jest.fn();
  });

  afterEach(() => {
    Dependency.prototype.depend = originalDepend;
    Dependency.prototype.notify = originalNotify;
  });

  it('should return true on __proxy__', () => {
    expect(array.__proxy__).toBe(true);
  });

  describe('getting sample mutating method: push', () => {
    it('should preserve original behavior', () => {
      array.push(4);
      expect(array).toHaveLength(4);
    });

    it('should notify', () => {
      array.push(4);
      expect(mockNotify).toHaveBeenCalledTimes(1);
    });
  });

  describe('getting item from array', () => {
    it('should return item', () => {
      expect(array[0]).toBe(1);
    });

    it('should depend', () => {
      const test = array[0];
      expect(mockDepend).toHaveBeenCalledTimes(1);
    });

    it('should execute as intended if used with forEach', () => {
      const array2 = [];
      array.forEach((item) => array2.push(item));

      expect(array2).toEqual(expect.arrayContaining([1, 2, 3]));
      expect(mockDepend).toHaveBeenCalledTimes(3);
    });

    it('should execute as intended if used with map', () => {
      const array2 = array.map((item) => item);

      expect(array2).toEqual(expect.arrayContaining([1, 2, 3]));
      expect(mockDepend).toHaveBeenCalledTimes(3);
    });
  });

  describe('getting function from array', () => {
    it('should return original Array.prototype function', () => {
      expect(array.map).toBe(Array.prototype.map);
    });
  });

  describe('getting function that does not exist', () => {
    it('should return undefined', () => {
      expect(array.foobar).toBeUndefined();
    });
  });

  describe('setting item', () => {
    it('should notify', () => {
      array[0] = 1;
      expect(mockNotify).toHaveBeenCalledTimes(1);
    });

    it('should set item', () => {
      const fn = jest.fn();
      array[0] = 2;
      array.map = fn;

      expect(array[0]).toBe(2);
      expect(array.map).toBe(fn);
    });
  });
});
