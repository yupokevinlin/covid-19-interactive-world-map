export namespace MathUtils {
  export const baseLog = (base: number, value: number): number => {
    return Math.log(value) / Math.log(base);
  };

  export const abbreviateNumber = (number: number, showDecimalForOnes?: boolean): string => {
    const SI_SYMBOL: Array<string> = ["", "k", "M", "B", "T", "P", "E"];

    const tier: number = (Math.log10(number) / 3) | 0;

    if (tier === 0) {
      return number.toString();
    }

    const suffix: string = SI_SYMBOL[tier];
    const scale: number = Math.pow(10, tier * 3);
    const scaled: number = number / scale;
    if (!!showDecimalForOnes) {
      const addDecimal: boolean = scaled % 1 > 0;
      return scaled.toFixed(addDecimal ? 1 : 0) + suffix;
    } else {
      return scaled.toFixed(0) + suffix;
    }
  };
}
