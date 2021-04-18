import {ESRIMapPolygon} from "../../../display/components/ESRIMap/types";

export interface MapPageState {
  initComplete: boolean;
  mapPolygons: Array<ESRIMapPolygon>;
  dateValues: Array<string>;
  focusMapGeometry: Array<Array<[number, number]>>;
}

export enum MapPageActionTypes {
  INIT = "map.INIT",
  SET_INIT_COMPLETE = "map.SET_INIT_COMPLETE",
  SET_MAP_POLYGONS = "map.SET_MAP_POLYGONS",
  SET_DATE_VALUES = "map.SET_DATE_VALUES",
  SET_FOCUS_MAP_GEOMETRY = "map.SET_FOCUS_MAP_GEOMETRY",
  HANDLE_REGION_CHANGE = "map.HANDLE_REGION_CHANGE",
}