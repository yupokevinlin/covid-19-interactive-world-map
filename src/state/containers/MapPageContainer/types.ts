import { ESRIMapModeNames, MapPolygon } from "../../../display/components/ESRIMap/ESRIMap";
import { BreadCrumbItem } from "../../../display/components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";

export interface MapPageContainerState {
  isLoaded: boolean;
  worldConfirmedCasesCount: number;
  confirmedCasesCount: number;
  worldDeathsCount: number;
  deathsCount: number;
  worldRecoveredCasesCount: number;
  recoveredCasesCount: number;
  language: string;
  mapPolygonData: Array<MapPolygon>;
  regionSelectData: BreadCrumbItem;
  currentLayer: ESRIMapModeNames;
  currentCountryCode: string;
  currentCountryName: string;
}

export enum MapPageContainerActionTypes {
  INITIALIZE = "map.page.INITIALIZE",
  SET_MAP_PAGE_CONTAINER_STATE = "map.page.SET_MAP_PAGE_CONTAINER_STATE",
  HANDLE_COUNT_DISPLAY_TYPE_CHANGE = "map.page.HANDLE_COUNT_DISPLAY_TYPE_CHANGE",
  HANDLE_REGION_CHANGE = "map.page.HANDLE_REGION_CHANGE",
}

export interface GetMapPolygonReturnData {
  mapPolygon: Array<MapPolygon>;
  worldConfirmedCasesCount: number;
  worldRecoveredCasesCount: number;
  worldDeathsCount: number;
}
