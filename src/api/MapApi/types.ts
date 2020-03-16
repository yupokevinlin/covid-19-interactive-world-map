export interface CountryOutline {
  name: CountryOutlineName;
  geometry: Array<Array<LatLon>>;
}

export interface CountryOutlineName {
  ar: string;
  bn: string;
  de: string;
  en: string;
  es: string;
  fr: string;
  el: string;
  hi: string;
  hu: string;
  id: string;
  it: string;
  ja: string;
  ko: string;
  nl: string;
  pl: string;
  pt: string;
  ru: string;
  sv: string;
  tr: string;
  vi: string;
  zh: string;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface ClassBreak {
  minValue: number;
  maxValue: number;
}

export interface ClassBreakColors {
  none: string;
  low: string;
  medium: string;
  high: string;
  extreme: string;
}

export const MapConfirmedCasesClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FFFF00",
  medium: "#FF0000",
  high: "#9900FF",
  extreme: "#000000",
};
