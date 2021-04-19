import {ESRIMapPolygon} from "../../../display/components/ESRIMap/types";

export interface MapPageState {
  initComplete: boolean;
  mapPolygons: Array<ESRIMapPolygon>;
  dateValues: Array<string>;
  mapRegionUpdateGeometry: Array<Array<[number, number]>>;
  breadcrumbsRegionUpdateGeometry: Array<Array<[number, number]>>;
  countryCode: string;
}

export enum MapPageActionTypes {
  INIT = "map.INIT",
  SET_INIT_COMPLETE = "map.SET_INIT_COMPLETE",
  SET_MAP_POLYGONS = "map.SET_MAP_POLYGONS",
  SET_DATE_VALUES = "map.SET_DATE_VALUES",
  SET_MAP_REGION_UPDATE_GEOMETRY = "map.SET_MAP_REGION_UPDATE_GEOMETRY",
  SET_BREADCRUMBS_REGION_UPDATE_GEOMETRY = "map.SET_BREADCRUMBS_REGION_UPDATE_GEOMETRY",
  SET_COUNTRY_CODE = "map.SET_COUNTRY_CODE",
  HANDLE_MAP_REGION_CHANGE = "map.HANDLE_MAP_REGION_CHANGE",
  HANDLE_BREADCRUMBS_REGION_CHANGE = "map.HANDLE_BREADCRUMBS_REGION_CHANGE"
}