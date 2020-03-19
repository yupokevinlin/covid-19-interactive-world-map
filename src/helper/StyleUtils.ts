export namespace StyleUtils {
  export function getCssPixelString(value: number | string): string {
    return typeof value === "number" ? `${value}px` : value ? value : "";
  }

  export function getCssRemString(value: number | string): string {
    return typeof value === "number" ? `${value}rem` : value ? value : "";
  }

  export function getCssPropertyFromArray(value: any): any {
    let returnString = "";
    const isArray: boolean = Array.isArray(value);
    if (isArray) {
      const allUndefined: boolean = value.every(element => element === undefined);
      if (allUndefined) {
        return returnString;
      }
      const typeArray: Array<string> = value.map(element => typeof element);
      const hasNumber: boolean = typeArray.includes("number");
      const hasString: boolean = typeArray.includes("string");
      if (hasNumber && hasString) {
        console.error(`Css configuration array cannot have both string and number. Config: ${value}`);
        return returnString;
      }
      const undefinedValue: any = hasNumber ? 0 : "";
      const top: any = value[0] || undefinedValue;
      const right: any = value[1] || undefinedValue;
      const bottom: any = value[2] || undefinedValue;
      const left: any = value[3] || undefinedValue;
      returnString = `${getCssPixelString(top)} ${getCssPixelString(right)} ${getCssPixelString(
        bottom
      )} ${getCssPixelString(left)}`;
    } else {
      returnString = getCssPixelString(value);
    }
    return returnString;
  }

  export function getNormalizedFontSize(size: number): number {
    return (size / 10) * getRootFontSize();
  }

  export function getRootFontSize(): number {
    return (
      parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("font-size")
          .replace("px", "")
      ) || 10
    );
  }

  export function getNormalizedPixelString(size: number | string): string {
    if (typeof size === "string") {
      return size;
    } else {
      return `${getNormalizedFontSize(size)}px`;
    }
  }

  export function addNormalizedPixelString(sizeA: number | string, sizeB: number | string) {
    const isNumberA: boolean = typeof sizeA === "number";
    const isNumberB: boolean = typeof sizeB === "number";
    if (isNumberA && isNumberB) {
      const numberA: number = sizeA as number;
      const numberB: number = sizeB as number;
      const sum: number = numberA + numberB;
      return getNormalizedPixelString(sum);
    } else {
      const stringA: string = getNormalizedPixelString(sizeA);
      const stringB: string = getNormalizedPixelString(sizeB);
      return `calc(${stringA} + ${stringB})`;
    }
  }

  export function subtractNormalizedPixelString(sizeA: number | string, sizeB: number | string) {
    const isNumberA: boolean = typeof sizeA === "number";
    const isNumberB: boolean = typeof sizeB === "number";
    if (isNumberA && isNumberB) {
      const numberA: number = sizeA as number;
      const numberB: number = sizeB as number;
      const sum: number = numberA - numberB;
      return getNormalizedPixelString(sum);
    } else {
      const stringA: string = getNormalizedPixelString(sizeA);
      const stringB: string = getNormalizedPixelString(sizeB);
      return `calc(${stringA} - ${stringB})`;
    }
  }

  export function getNormalizedArrayPixelString(size: number | Array<number>): string {
    if (Array.isArray(size)) {
      const length: number = size.length;
      switch (length) {
        case 1:
          const all: string = getNormalizedPixelString(size[0]);
          return `${all} ${all} ${all} ${all}`;
        case 2:
          const topBottom2: string = getNormalizedPixelString(size[0]);
          const leftRight2: string = getNormalizedPixelString(size[1]);
          return `${topBottom2} ${leftRight2} ${topBottom2} ${leftRight2}`;
        case 3:
          const top3: string = getNormalizedPixelString(size[0]);
          const leftRight3: string = getNormalizedPixelString(size[1]);
          const bottom3: string = getNormalizedPixelString(size[2]);
          return `${top3} ${leftRight3} ${bottom3} ${leftRight3}`;
        case 4:
          const top4: string = getNormalizedPixelString(size[0]);
          const right4: string = getNormalizedPixelString(size[1]);
          const bottom4: string = getNormalizedPixelString(size[2]);
          const left4: string = getNormalizedPixelString(size[3]);
          return `${top4} ${right4} ${bottom4} ${left4}`;
        default:
          console.log(`Array of length ${length}: ${Array.toString()} is not supported.`);
          return "0px 0px 0px 0px";
      }
    } else {
      const all: string = getNormalizedPixelString(size || 0);
      return `${all} ${all} ${all} ${all}`;
    }
  }

  export function getTopBottomPixelNumber(size: number | Array<number>): number {
    if (Array.isArray(size)) {
      const length: number = size.length;
      switch (length) {
        case 1:
        case 2:
          return size[0] * 2;
        case 3:
        case 4:
          return size[0] + size[2];
        default:
          console.log(`Array of length ${length}: ${Array.toString()} is not supported.`);
          return 0;
      }
    } else {
      return size * 2;
    }
  }

  export function getLeftRightPixelNumber(size: number | Array<number>): number {
    if (Array.isArray(size)) {
      const length: number = size.length;
      switch (length) {
        case 1:
        case 2:
          return size[1] * 2;
        case 3:
          return size[1];
        case 4:
          return size[1] + size[3];
        default:
          console.log(`Array of length ${length}: ${Array.toString()} is not supported.`);
          return 0;
      }
    } else {
      return size * 2;
    }
  }

  export function getRandomColor(): string {
    return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  }
}
