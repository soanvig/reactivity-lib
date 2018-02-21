// Dependency is dependency tracker
// Each tracked value (property of some state object)
// should have it's own Dep object.
class Dependency {
  constructor () {
    // In Set each object must be unique.
    // Adding one thing as dependency multiple times
    // adds it only once.
    // As `dependency` we understand function that called tracked value.
    this.dependencies = new Set();
  }

  depend () {
    if (Dependency.activeFunction) {
      this.dependencies.add(Dependency.activeFunction);
    }
  }

  notify () {
    // Call each function that originally
    // depends on tracked value.
    this.dependencies.forEach((f) => {
      f();
    });
  }
}

// Because JS is one-threaded, only one function
// can be called at any time. Because of that - simplified - statement
// we can save that function in 'global' object.
Dependency.activeFunction = null;

export default Dependency;