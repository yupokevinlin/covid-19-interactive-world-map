import {MapPageActionTypes, MapPageState} from "./types";
import {ESRIMapModeNames} from "../../../display/components/ESRIMap/ESRIMap";
import {MapPageAction} from "./actions";
import {DateUtils} from "../../../helper/DateUtils";

export const initialState: MapPageState = {
  mapPolygons: [],
  displayedLayer: ESRIMapModeNames.confirmedCases,
  date: DateUtils.getCurrentDate(),
  hierarchicalName: "World",
  initialBaseMap: "streets",
  dateValues: [],
};

export const reducer = (state: MapPageState = initialState, action: MapPageAction): MapPageState => {
  switch (action.type) {
    case MapPageActionTypes.SET_MAP_POLYGONS: {
      return {
        ...state,
        mapPolygons: [...action.mapPolygons],
      }
    }
    case MapPageActionTypes.SET_DISPLAYED_LAYER: {
      return {
        ...state,
        displayedLayer: action.displayedLayer,
      }
    }
    case MapPageActionTypes.SET_DATE: {
      return {
        ...state,
        date: action.date,
      }
    }
    case MapPageActionTypes.SET_HIERARCHICAL_NAME: {
      return {
        ...state,
        hierarchicalName: action.hierarchicalName,
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