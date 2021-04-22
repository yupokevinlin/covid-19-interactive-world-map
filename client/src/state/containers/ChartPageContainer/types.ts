export interface ChartPageState {
  initComplete: boolean;
  countryCode: string;
}

export enum ChartPageActionTypes {
  INIT = "chart.INIT",
  SET_INIT_COMPLETE = "chart.SET_INIT_COMPLETE",
  SET_COUNTRY_CODE = "chart.SET_COUNTRY_CODE",
  HANDLE_BREADCRUMBS_REGION_CHANGE = "chart.HANDLE_BREADCRUMBS_REGION_CHANGE"
}