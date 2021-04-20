export interface ChartPageState {
  initComplete: boolean;
}

export enum ChartPageActionTypes {
  INIT = "chart.INIT",
  SET_INIT_COMPLETE = "chart.SET_INIT_COMPLETE",
}