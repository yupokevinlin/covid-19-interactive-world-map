import { ESRIMapModeNames, MapPolygon } from "../../../display/components/ESRIMap/ESRIMap";
import { BreadCrumbItem } from "../../../display/components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import {
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../../shared/types/data/Cases/CasesTypes";

export interface MapPageContainerState {
  isLoaded: boolean;
  worldCasesData: ServerTimeSeriesCasesData;
  casesData: ServerTimeSeriesCasesDataObject;
  displayedConfirmedCasesCount: number;
  displayedDeathsCount: number;
  displayedRecoveredCasesCount: number;
  language: string;
  mapPolygonData: Array<MapPolygon>;
  regionSelectData: BreadCrumbItem;
  currentLayer: ESRIMapModeNames;
  currentName: Array<string>;
  currentDateString: string;
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
