export interface HomePageState {
  initComplete: boolean;
}

export enum HomePageActionTypes {
  INIT = "home.INIT",
  SET_INIT_COMPLETE = "home.SET_INIT_COMPLETE",
}