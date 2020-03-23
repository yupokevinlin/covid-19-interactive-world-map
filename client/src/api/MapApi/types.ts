export interface CountryOutline {
  name: Array<string>;
  countryCode: string;
  geometry: Array<Array<LatLon>>;
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

export const MapRecoveredCasesClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#99FF99",
  medium: "#33FF33",
  high: "#00CC00",
  extreme: "#006600",
};

export const MapDeathsClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FF9999",
  medium: "#FF3333",
  high: "#CC0000",
  extreme: "#660000",
};
