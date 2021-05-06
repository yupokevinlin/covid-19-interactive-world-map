import {CurrentCasesSummary} from "../../../../../shared/types/data/Cases/CasesTypes";

export interface HomePageState {
  initComplete: boolean;
  summaryData: CurrentCasesSummary;
}

export enum HomePageActionTypes {
  INIT = "home.INIT",
  SET_INIT_COMPLETE = "home.SET_INIT_COMPLETE",
  SET_SUMMARY_DATA = "home.SET_SUMMARY_DATA",
}
