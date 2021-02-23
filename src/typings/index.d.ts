export {};
type json = Record<string, any>;
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDeepCloseTo: (
        expected: number | number[] | json,
        decimals?: number,
      ) => R;
      toMatchCloseTo: (
        expected: number | number[] | json,
        decimals?: number,
      ) => R;
    }
  }
}
