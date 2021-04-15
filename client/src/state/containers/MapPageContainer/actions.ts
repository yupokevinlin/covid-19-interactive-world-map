import {MapPageActionTypes} from "./types";
import {ESRIMapModeNames, ESRIMapPolygon} from "../../../display/components/ESRIMap/ESRIMap";

export type MapPageAction = MapPageInitAction
| MapPageSetMapPolygonsAction
| MapPageSetDisplayedLayerAction
| MapPageSetDateAction
| MapPageSetHierarchicalNameAction
| MapPageSetDateValuesAction;

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

export interface MapPageSetDisplayedLayerAction {
  type: typeof MapPageActionTypes.SET_DISPLAYED_LAYER;
  displayedLayer: ESRIMapModeNames;
}
export const setDisplayedLayer = (displayedLayer: ESRIMapModeNames): MapPageSetDisplayedLayerAction => {
  return {
    type: MapPageActionTypes.SET_DISPLAYED_LAYER,
    displayedLayer: displayedLayer,
  };
};

export interface MapPageSetDateAction {
  type: typeof MapPageActionTypes.SET_DATE;
  date: string;
}
export const setDate = (date: string): MapPageSetDateAction => {
  return {
    type: MapPageActionTypes.SET_DATE,
    date: date,
  };
};

export interface MapPageSetHierarchicalNameAction {
  type: typeof MapPageActionTypes.SET_HIERARCHICAL_NAME;
  hierarchicalName: string;
}
export const setHierarchicalName = (hierarchicalName: string): MapPageSetHierarchicalNameAction => {
  return {
    type: MapPageActionTypes.SET_HIERARCHICAL_NAME,
    hierarchicalName: hierarchicalName,
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