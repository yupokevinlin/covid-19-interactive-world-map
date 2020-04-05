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
  low: "#33FF33",
  medium: "#006600",
  high: "#006699",
  extreme: "#000099",
};

export const MapDeathsClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FF9999",
  medium: "#FF3333",
  high: "#9900FF",
  extreme: "#000000",
};
