import {PageName, PageWrapperContainerActionTypes, PageWrapperContainerState} from "./types";
import {PageWrapperContainerAction} from "./actions";

export const initialState: PageWrapperContainerState = {
  currentPage: PageName.Intro
};

export const reducer = (
  state: PageWrapperContainerState = initialState,
  action: PageWrapperContainerAction
): PageWrapperContainerState => {
  switch (action.type) {
    case PageWrapperContainerActionTypes.SET_PAGE_WRAPPER_CONTAINER_STATE: {
      return {
        ...action.state
      };
    }
    default: {
      return state;
    }
  }
};