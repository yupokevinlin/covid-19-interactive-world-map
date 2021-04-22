import {ChartPageActionTypes, ChartPageState} from "./types";
import {ChartPageAction} from "./actions";

export const initialState: ChartPageState = {
  initComplete: false,
  countryCode: "World",
};

export const reducer = (state: ChartPageState = initialState, action: ChartPageAction): ChartPageState => {
  switch (action.type) {
    case ChartPageActionTypes.SET_INIT_COMPLETE: {
      return {
        ...state,
        initComplete: action.initComplete,
      }
    }
    case ChartPageActionTypes.SET_COUNTRY_CODE: {
      return {
        ...state,
        countryCode: action.countryCode,
      }
    }
    default: {
      return state;
    }
  }
};