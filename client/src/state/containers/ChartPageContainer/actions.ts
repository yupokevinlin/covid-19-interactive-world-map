import {ChartPageActionTypes} from "./types";

export type ChartPageAction = ChartPageInitAction
| ChartPageSetInitCompleteAction;

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