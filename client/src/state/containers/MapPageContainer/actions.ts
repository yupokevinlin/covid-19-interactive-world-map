import {MapPageActionTypes} from "./types";
import { ESRIMapPolygon } from "src/display/components/ESRIMap/types";

export type MapPageAction = MapPageInitAction
| MapPageSetMapPolygonsAction
| MapPageSetInitCompleteAction
| MapPageSetDateValuesAction
| MapPageSetMapRegionUpdateGeometryAction
| MapPageSetBreadcrumbsRegionUpdateGeometryAction
| MapPageSetCountryCodeAction
| MapPageHandleMapRegionChangeAction
| MapPageHandleBreadcrumbsRegionChangeAction;

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

export interface MapPageSetMapRegionUpdateGeometryAction {
  type: typeof MapPageActionTypes.SET_MAP_REGION_UPDATE_GEOMETRY;
  regionUpdateGeometry: Array<Array<[number, number]>>;
}
export const setMapRegionUpdateGeometry = (regionUpdateGeometry: Array<Array<[number, number]>>): MapPageSetMapRegionUpdateGeometryAction => {
  return {
    type: MapPageActionTypes.SET_MAP_REGION_UPDATE_GEOMETRY,
    regionUpdateGeometry: regionUpdateGeometry,
  };
};

export interface MapPageSetBreadcrumbsRegionUpdateGeometryAction {
  type: typeof MapPageActionTypes.SET_BREADCRUMBS_REGION_UPDATE_GEOMETRY;
  regionUpdateGeometry: Array<Array<[number, number]>>;
}
export const setBreadcrumbsRegionUpdateGeometry = (regionUpdateGeometry: Array<Array<[number, number]>>): MapPageSetBreadcrumbsRegionUpdateGeometryAction => {
  return {
    type: MapPageActionTypes.SET_BREADCRUMBS_REGION_UPDATE_GEOMETRY,
    regionUpdateGeometry: regionUpdateGeometry,
  };
};

export interface MapPageSetCountryCodeAction {
  type: typeof MapPageActionTypes.SET_COUNTRY_CODE;
  countryCode: string;
}
export const setCountryCode = (countryCode: string): MapPageSetCountryCodeAction => {
  return {
    type: MapPageActionTypes.SET_COUNTRY_CODE,
    countryCode: countryCode,
  };
};

export interface MapPageHandleMapRegionChangeAction {
  type: typeof MapPageActionTypes.HANDLE_MAP_REGION_CHANGE;
  hierarchicalName: string;
}
export const handleMapRegionChange = (hierarchicalName: string): MapPageHandleMapRegionChangeAction => {
  return {
    type: MapPageActionTypes.HANDLE_MAP_REGION_CHANGE,
    hierarchicalName: hierarchicalName,
  };
};

export interface MapPageHandleBreadcrumbsRegionChangeAction {
  type: typeof MapPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE;
  hierarchicalName: string;
}
export const handleBreadcrumbsRegionChange = (hierarchicalName: string): MapPageHandleBreadcrumbsRegionChangeAction => {
  return {
    type: MapPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE,
    hierarchicalName: hierarchicalName,
  };
};