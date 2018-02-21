import Dependency from './Dependency';

// Because we can't just 'get access' to 'already executing' function
// we need to create wrapper, that will save that for us.
// Any time `f` innerFunction will be executed
// it will register itself as currently executing function.
export default function watch (f) {
  function innerFunction () {
    Dependency.activeFunction = innerFunction;
    f();
    Dependency.activeFunction = null;
  }

  return innerFunction;
}