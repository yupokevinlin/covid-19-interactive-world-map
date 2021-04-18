import {MapPageActionTypes} from "./types";
import { ESRIMapPolygon } from "src/display/components/ESRIMap/types";

export type MapPageAction = MapPageInitAction
| MapPageSetMapPolygonsAction
| MapPageSetInitCompleteAction
| MapPageSetDateValuesAction
| MapPageSetFocusMapGeometryAction
| MapPageHandleRegionChangeAction;

export interface MapPageInitAction {
  type: typeof MapPageActionTypes.INIT;
}
export const init = (): MapPageInitAction => {
  return {
    type: MapPageActionTypes.INIT
  };
};

export interface MapPageSetInitCompleteAction {
  type: typeof MapPageActionTypes.SET_INIT_COMPLETE;
  initComplete: boolean;
}
export const setInitComplete = (initComplete: boolean): MapPageSetInitCompleteAction => {
  return {
    type: MapPageActionTypes.SET_INIT_COMPLETE,
    initComplete: initComplete,
  };
};

export interface MapPageSetMapPolygonsAction {
  type: typeof MapPageActionTypes.SET_MAP_POLYGONS;
  mapPolygons: Array<ESRIMapPolygon>;
}
export const setMapPolygons = (mapPolygons: Array<ESRIMapPolygon>): MapPageSetMapPolygonsAction => {
  return {
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: mapPolygons,
  };
};

export interface MapPageSetDateValuesAction {
  type: typeof MapPageActionTypes.SET_DATE_VALUES;
  dateValues: Array<string>;
}
export const setDateValues = (dateValues: Array<string>): MapPageSetDateValuesAction => {
  return {
    type: MapPageActionTypes.SET_DATE_VALUES,
    dateValues: dateValues,
  };
};

export interface MapPageSetFocusMapGeometryAction {
  type: typeof MapPageActionTypes.SET_FOCUS_MAP_GEOMETRY;
  focusMapGeometry: Array<Array<[number, number]>>
}
export const setFocusMapGeometry = (focusMapGeometry: Array<Array<[number, number]>>): MapPageSetFocusMapGeometryAction => {
  return {
    type: MapPageActionTypes.SET_FOCUS_MAP_GEOMETRY,
    focusMapGeometry: focusMapGeometry,
  };
};

export interface MapPageHandleRegionChangeAction {
  type: typeof MapPageActionTypes.HANDLE_REGION_CHANGE;
  hierarchicalName: string;
}
export const handleRegionChange = (hierarchicalName: string): MapPageHandleRegionChangeAction => {
  return {
    type: MapPageActionTypes.HANDLE_REGION_CHANGE,
    hierarchicalName: hierarchicalName,
  };
};