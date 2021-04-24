import {HomePageActionTypes} from "./types";

export type HomePageAction = HomePageInitAction
| HomePageSetInitCompleteAction;

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