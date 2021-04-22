import {ChartPageActionTypes} from "./types";

export type ChartPageAction = ChartPageInitAction
| ChartPageSetInitCompleteAction
| ChartPageSetCountryCodeAction
| ChartPageHandleBreadcrumbsRegionChangeAction;

export interface ChartPageInitAction {
  type: typeof ChartPageActionTypes.INIT;
}
export const init = (): ChartPageInitAction => {
  return {
    type: ChartPageActionTypes.INIT
  };
};

export interface ChartPageSetInitCompleteAction {
  type: typeof ChartPageActionTypes.SET_INIT_COMPLETE;
  initComplete: boolean;
}
export const setInitComplete = (initComplete: boolean): ChartPageSetInitCompleteAction => {
  return {
    type: ChartPageActionTypes.SET_INIT_COMPLETE,
    initComplete: initComplete,
  };
};

export interface ChartPageSetCountryCodeAction {
  type: typeof ChartPageActionTypes.SET_COUNTRY_CODE;
  countryCode: string;

}
export const setCountryCode = (countryCode: string): ChartPageSetCountryCodeAction => {
  return {
    type: ChartPageActionTypes.SET_COUNTRY_CODE,
    countryCode: countryCode,
  };
};

export interface ChartPageHandleBreadcrumbsRegionChangeAction {
  type: typeof ChartPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE;
  hierarchicalName: string;
}
export const handleBreadcrumbsRegionChange = (hierarchicalName: string): ChartPageHandleBreadcrumbsRegionChangeAction => {
  return {
    type: ChartPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE,
    hierarchicalName: hierarchicalName,
  };
};