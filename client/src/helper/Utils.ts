export namespace Utils {
  export function createDoubleMap<TKey1 extends string, TKey2 extends string>(kvps: Array<[TKey1, TKey2]>): { [key in TKey1]: TKey2 } & { [key in TKey2]: TKey1 } {
    return Object.fromEntries([...kvps, ...kvps.map(([x, y]) => ([y, x]))])
  }
}