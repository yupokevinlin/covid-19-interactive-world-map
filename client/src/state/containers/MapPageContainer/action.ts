import {MapPageContainerActionTypes, MapPageContainerState, RegionChangeEvent} from "./types";
import { CountDisplayButtonClickEvent } from "../../../display/components/CountDisplayButton/CountDisplayButton";
import { ListMenuSelectEvent } from "../../../display/components/ListMenu/ListMenuItem/ListMenuItem";

export type MapPageContainerAction =
  | MapPageContainerInitializeAction
  | MapPageContainerSetMapPageContainerStateAction
  | MapPageContainerHandleCountDisplayTypeChangeAction
  | MapPageContainerHandleRegionChangeAction;

export interface MapPageContainerInitializeAction {
  type: typeof MapPageContainerActionTypes.INITIALIZE;
}
export const initialize = (): MapPageContainerInitializeAction => {
  return {
    type: MapPageContainerActionTypes.INITIALIZE,
  };
};

export interface MapPageContainerSetMapPageContainerStateAction {
  type: typeof MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE;
  state: MapPageContainerState;
}
export const setMapPageContainerState = (
  state: MapPageContainerState
): MapPageContainerSetMapPageContainerStateAction => {
  return {
    type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
    state: state,
  };
};

export interface MapPageContainerHandleCountDisplayTypeChangeAction {
  type: typeof MapPageContainerActionTypes.HANDLE_COUNT_DISPLAY_TYPE_CHANGE;
  event: CountDisplayButtonClickEvent;
}
export const handleCountDisplayTypeChange = (
  event: CountDisplayButtonClickEvent
): MapPageContainerHandleCountDisplayTypeChangeAction => {
  return {
    type: MapPageContainerActionTypes.HANDLE_COUNT_DISPLAY_TYPE_CHANGE,
    event: event,
  };
};

export interface MapPageContainerHandleRegionChangeAction {
  type: typeof MapPageContainerActionTypes.HANDLE_REGION_CHANGE;
  event: RegionChangeEvent;
}
export const handleRegionChange = (event: RegionChangeEvent): MapPageContainerHandleRegionChangeAction => {
  return {
    type: MapPageContainerActionTypes.HANDLE_REGION_CHANGE,
    event: event,
  };
};
