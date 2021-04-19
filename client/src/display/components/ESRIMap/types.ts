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
  low: "#AAFFAA",
  medium: "#55FF55",
  high: "#00FF00",
  extreme: "#55AAFF",
};

export const MapTotalRecoveriesClassBreakDomain: Array<number> = [0, 2, 4, 6, 8];

export const MapTotalDeathsClassBreakColors: ClassBreakColors = {
  none: "#FFFFFF",
  low: "#FFAAAA",
  medium: "#FF5555",
  high: "#FF0000",
  extreme: "#330000",
};

export const MapTotalDeathsClassBreakDomain: Array<number> = [0, 2, 4, 6, 8];

export const classBreakSteps: number = 8;

export enum ESRIMapLayerNames {
  polygonLayer = "polygon-layer",
}

export enum ESRIMapModeNames {
  totalCases = "Total Cases",
  totalRecovered = "Total Recovered",
  totalDeaths = "Total Deaths",
}