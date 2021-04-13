import {AppActionTypes, AppState, PageColors, Pages} from "./types";
import {AppAction} from "./actions";

export const initialState: AppState = {
  isInitComplete: false,
  isLoading: false,
  version: "0.0.1",
  title: `${Pages.HOME}`,
  theme: null,
  themeColor: PageColors.HOME,
  page: Pages.HOME,
  subPage: null,
  menuItems: [],
};

export const reducer = (state: AppState = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case AppActionTypes.SET_IS_INIT_COMPLETE: {
      return {
        ...state,
        isInitComplete: action.isInitComplete,
      }
    }
    case AppActionTypes.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case AppActionTypes.SET_THEME: {
      return {
        ...state,
        theme: action.theme,
      }
    }
    case AppActionTypes.SET_THEME_COLOR: {
      return {
        ...state,
        themeColor: action.themeColor,
      }
    }
    case AppActionTypes.SET_TITLE: {
      const title: string = `${action.page}`;
      window.document.title = title;
      return {
        ...state,
        title: title,
      }
    }
    case AppActionTypes.SET_VERSION: {
      return {
        ...state,
        version: action.version,
      }
    }
    case AppActionTypes.SET_PAGE: {
      return {
        ...state,
        page: action.page,
        subPage: action.subPage,
      }
    }
    case AppActionTypes.SET_MENU_ITEMS: {
      return {
        ...state,
        menuItems: action.menuItems,
      }
    }
    default:
      return state;
  }
};