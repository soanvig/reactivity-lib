import Dependency from './Dependency';

describe('Dependency', () => {
  let dep;

  beforeEach(() => {
    dep = new Dependency();
  });

  afterEach(() => {
    Dependency.activeFunction = null;
  });

  it('should have global activeFunction set initially to null', () => {
    expect(Dependency.activeFunction).toBeNull();
  });

  describe('constructor', () => {
    it('should have .dependencies Set', () => {
      expect(dep.dependencies).toBeInstanceOf(Set);
    });
  });

  describe('depend()', () => {
    it('should add Dependency.activeFunction to dependencies', () => {
      const f = jest.fn();

      Dependency.activeFunction = f;
      dep.depend();
      expect(dep.dependencies).toContain(f);
    });

    it('should not add dependency if no Dependency.activeFunction', () => {
      dep.depend();
      expect(dep.dependencies.size).toBe(0);
    });
  });

  describe('notify()', () => {
    it('should call all functions saved in .dependencies set', () => {
      const f1 = jest.fn();
      const f2 = jest.fn();

      dep.dependencies.add(f1);
      dep.dependencies.add(f2);

      dep.notify();

      expect(f1).toHaveBeenCalledTimes(1);
      expect(f2).toHaveBeenCalledTimes(1);
    });
  });
});