type MemoizedFn<Func> = Func & { memoized: boolean };
type Fn<Args extends any[], Result> = (...args: Args) => Result;

const memoize = function memoizedFn<Args extends any[], R>(
  fn: Fn<Args, R>
): MemoizedFn<Fn<Args, R>> {
  const memoizeCache: { [key: string]: R } = {};
  const memoizedFunction = function (this: any) {
    const key = JSON.stringify(arguments);
    if (memoizeCache[key]) {
      return memoizeCache[key];
    } else {
      const val = fn.apply(this, arguments as any);
      memoizeCache[key] = val;
      return val;
    }
  };

  memoizedFunction.memoized = true;

  return memoizedFunction;
};

export { memoize };
