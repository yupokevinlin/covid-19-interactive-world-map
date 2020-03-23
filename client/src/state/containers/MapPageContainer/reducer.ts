import { MapPageContainerActionTypes, MapPageContainerState } from "./types";
import { ESRIMapModeNames } from "../../../display/components/ESRIMap/ESRIMap";
import { MapPageContainerAction } from "./action";

export const initialState: MapPageContainerState = {
  isLoaded: false,
  displayedConfirmedCasesCount: 0,
  displayedDeathsCount: 0,
  displayedRecoveredCasesCount: 0,
  worldCasesData: {
    name: [],
    hasChildren: true,
    data: {}
  },
  casesData: {},
  language: "en",
  mapPolygonData: [],
  regionSelectData: {
    name: ["World"],
    childElements: [],
  },
  currentLayer: ESRIMapModeNames.confirmedCases,
  currentName: [],
  currentDateString: ""
};

export const reducer = (
  state: MapPageContainerState = initialState,
  action: MapPageContainerAction
): MapPageContainerState => {
  switch (action.type) {
    case MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE: {
      return {
        ...action.state,
      };
    }
    case MapPageContainerActionTypes.HANDLE_COUNT_DISPLAY_TYPE_CHANGE: {
      return {
        ...state,
        currentLayer: action.event.name,
      };
    }
    default: {
      return state;
    }
  }
};
