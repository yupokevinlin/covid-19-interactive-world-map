import {HomePageActionTypes, HomePageState} from "./types";
import {HomePageAction} from "./actions";

export const initialState: HomePageState = {
  initComplete: false,
  summaryData: null,
};

export const reducer = (state: HomePageState = initialState, action: HomePageAction): HomePageState => {
  switch (action.type) {
    case HomePageActionTypes.SET_SUMMARY_DATA: {
      return {
        ...state,
        summaryData: action.summaryData,
      }
    }
    default: {
      return state;
    }
  }
};
