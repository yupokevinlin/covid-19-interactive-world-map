import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {CasesData} from "../../../../../shared/types/data/Cases/CasesTypes";

export type ESRIMapPolygon = MapPolygon & CasesData;

export interface ClassBreakColors {
  none: string;
  low: string;
  medium: string;
  high: string;
  extreme: string;
}

export const MapTotalCasesClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FFFF00",
  medium: "#FF0000",
  high: "#9900FF",
  extreme: "#000000",
};

export const MapTotalCasesClassBreakDomain: Array<number> = [0, 3, 5, 6, 8];

export const MapTotalRecoveriesClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#33FF33",
  medium: "#006600",
  high: "#006699",
  extreme: "#000099",
};

export const MapTotalRecoveriesClassBreakDomain: Array<number> = [0, 1.5, 3, 5, 8];

export const MapTotalDeathsClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FF9999",
  medium: "#FF3333",
  high: "#9900FF",
  extreme: "#000000",
};

export const MapTotalDeathsClassBreakDomain: Array<number> = [0, 1.5, 3, 5, 8];

export enum ESRIMapLayerNames {
  polygonLayer = "polygon-layer",
}

export enum ESRIMapModeNames {
  totalCases = "Total Cases",
  totalRecovered = "Total Recovered",
  totalDeaths = "Total Deaths",
}