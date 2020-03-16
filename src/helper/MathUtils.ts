export namespace MathUtils {
  export const baseLog = (base: number, value: number): number => {
    return Math.log(value) / Math.log(base);
  };
}
