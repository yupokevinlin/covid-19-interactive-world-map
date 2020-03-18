export namespace MathUtils {
  export const baseLog = (base: number, value: number): number => {
    return Math.log(value) / Math.log(base);
  };

  export const abbreviateNumber = (number: number): string => {
    const SI_SYMBOL: Array<string> = ["", "k", "M", "G", "T", "P", "E"];

    const tier: number = (Math.log10(number) / 3) | 0;

    if (tier === 0) {
      return number.toString();
    }

    const suffix: string = SI_SYMBOL[tier];
    const scale: number = Math.pow(10, tier * 3);
    const scaled: number = number / scale;
    return scaled.toFixed(0) + suffix;
  };
}
