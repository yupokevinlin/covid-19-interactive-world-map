import { MapPageContainerActionTypes, MapPageContainerState } from "./types";
import { ESRIMapModeNames } from "../../../display/components/ESRIMap/ESRIMap";
import { MapPageContainerAction } from "./action";

export const initialState: MapPageContainerState = {
  isLoaded: false,
  worldConfirmedCasesCount: 0,
  confirmedCasesCount: 0,
  worldDeathsCount: 0,
  deathsCount: 0,
  worldRecoveredCasesCount: 0,
  recoveredCasesCount: 0,
  language: "en",
  mapPolygonData: [],
  regionSelectData: {
    name: ["World"],
    childElements: [],
  },
  currentLayer: ESRIMapModeNames.confirmedCases,
  currentCountryCode: "World",
  currentCountryName: "World",
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
