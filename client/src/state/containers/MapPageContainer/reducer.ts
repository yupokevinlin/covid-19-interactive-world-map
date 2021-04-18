import {MapPageActionTypes, MapPageState} from "./types";
import {MapPageAction} from "./actions";

export const initialState: MapPageState = {
  initComplete: false,
  mapPolygons: [],
  dateValues: [],
};

export const reducer = (state: MapPageState = initialState, action: MapPageAction): MapPageState => {
  switch (action.type) {
    case MapPageActionTypes.SET_INIT_COMPLETE: {
      return {
        ...state,
        initComplete: action.initComplete,
      }
    }
    case MapPageActionTypes.SET_MAP_POLYGONS: {
      return {
        ...state,
        mapPolygons: [...action.mapPolygons],
      }
    }
    case MapPageActionTypes.SET_DATE_VALUES: {
      return {
        ...state,
        dateValues: [...action.dateValues],
      }
    }
    default: {
      return state;
    }
  }
};