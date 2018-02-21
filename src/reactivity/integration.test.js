import makeReactive from './makeReactive';
import watch from './watch';

describe('integration test', () => {
  let state;
  let render;
  let mock;

  beforeEach(() => {
    mock = jest.fn();

    state = {
      foo: 1,
      bar: 1
    };

    makeReactive(state);

    render = watch(() => {
      mock(state.foo);
    });

    render();
  });

  it('should initially render be called with state.foo (1)', () => {
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toBeCalledWith(1);
  });

  it('should call render with updated state.foo automagically', () => {
    state.foo += 1;

    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock).lastCalledWith(2);
  });

  it('should not call render when state.bar is updated', () => {
    state.bar += 1;

    expect(mock).toHaveBeenCalledTimes(1);
  });
});