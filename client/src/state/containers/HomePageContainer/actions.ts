import {HomePageActionTypes} from "./types";
import {CurrentCasesSummary} from "../../../../../shared/types/data/Cases/CasesTypes";

export type HomePageAction = HomePageInitAction
| HomePageSetInitCompleteAction
| HomePageSetSummaryDataAction;

export interface HomePageInitAction {
  type: typeof HomePageActionTypes.INIT;
}
export const init = (): HomePageInitAction => {
  return {
    type: HomePageActionTypes.INIT
  };
};

export interface HomePageSetInitCompleteAction {
  type: typeof HomePageActionTypes.SET_INIT_COMPLETE;
  initComplete: boolean;
}
export const setInitComplete = (initComplete: boolean): HomePageSetInitCompleteAction => {
  return {
    type: HomePageActionTypes.SET_INIT_COMPLETE,
    initComplete: initComplete,
  };
};

export interface HomePageSetSummaryDataAction {
  type: typeof HomePageActionTypes.SET_SUMMARY_DATA;
  summaryData: CurrentCasesSummary;
}
export const setSummaryData = (summaryData: CurrentCasesSummary): HomePageSetSummaryDataAction => {
  return {
    type: HomePageActionTypes.SET_SUMMARY_DATA,
    summaryData: summaryData,
  };
};
