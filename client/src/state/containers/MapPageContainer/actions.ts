import {MapPageActionTypes} from "./types";
import {ESRIMapPolygon} from "../../../display/components/ESRIMap/ESRIMap";

export type MapPageAction = MapPageInitAction
| MapPageSetMapPolygonsAction
| MapPageSetDateValuesAction
| MapPageHandleRegionChangeAction;

export interface MapPageInitAction {
  type: typeof MapPageActionTypes.INIT;
}
export const init = (): MapPageInitAction => {
  return {
    type: MapPageActionTypes.INIT
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