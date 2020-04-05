import {PageWrapperContainerActionTypes, PageWrapperContainerState} from "./types";

export type PageWrapperContainerAction =
  | PageWrapperContainerInitializeAction
  | PageWrapperContainerSetPageWrapperContainerStateAction;

export interface PageWrapperContainerInitializeAction {
  type: typeof PageWrapperContainerActionTypes.INITIALIZE;
}
export const initialize = (): PageWrapperContainerInitializeAction => {
  return {
    type: PageWrapperContainerActionTypes.INITIALIZE
  };
};

export interface PageWrapperContainerSetPageWrapperContainerStateAction {
  type: typeof PageWrapperContainerActionTypes.SET_PAGE_WRAPPER_CONTAINER_STATE;
  state: PageWrapperContainerState;
}
export const setPageWrapperContainerState = (state: PageWrapperContainerState): PageWrapperContainerSetPageWrapperContainerStateAction => {
  return {
    type: PageWrapperContainerActionTypes.SET_PAGE_WRAPPER_CONTAINER_STATE,
    state: state
  };
};