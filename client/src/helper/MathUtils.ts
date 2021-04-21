export namespace MathUtils {
  export const baseLog = (base: number, value: number): number => {
    return Math.log(value) / Math.log(base);
  };

  export const abbreviateNumber = (number: number, digits?: number): string => {
    const SI_SYMBOL: Array<string> = ["", "k", "M", "B", "T", "P", "E"];

    const tier: number = (Math.log10(number) / 3) | 0;

    if (tier === 0) {
      return number.toString();
    }

    const suffix: string = SI_SYMBOL[tier];
    const scale: number = Math.pow(10, tier * 3);
    const scaled: number = number / scale;
    return scaled.toFixed(digits || 0) + suffix;
  };
}
