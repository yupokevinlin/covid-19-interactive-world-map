import {AppActionTypes, AppState, Pages} from "./types";
import {AppAction} from "./actions";

export const initialState: AppState = {
  isInitComplete: false,
  displayLoadingBar: false,
  displayLoadingPage: false,
  version: "0.0.1",
  title: `${Pages.HOME}`,
  theme: null,
  page: Pages.HOME,
  subPage: null,
  menuItems: [],
  dataTree: null,
  casesDataObject: null,
  dailyCasesInformationDataObject: null,
  weeklyCasesInformationDataObject: null,
  monthlyCasesInformationDataObject: null,
  yearlyCasesInformationDataObject: null,
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
        displayLoadingBar: action.displayLoadingBar,
        displayLoadingPage: action.displayLoadingPage,
      }
    }
    case AppActionTypes.SET_THEME: {
      return {
        ...state,
        theme: action.theme,
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
    case AppActionTypes.SET_DATA_TREE: {
      return {
        ...state,
        dataTree: action.dataTree,
      }
    }
    case AppActionTypes.SET_CASES_DATA_OBJECT: {
      return {
        ...state,
        casesDataObject: action.casesDataObject,
      }
    }
    case AppActionTypes.SET_DAILY_CASES_INFORMATION_DATA_OBJECT: {
      return {
        ...state,
        dailyCasesInformationDataObject: action.casesInformationDataObject,
      }
    }
    case AppActionTypes.SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT: {
      return {
        ...state,
        weeklyCasesInformationDataObject: action.casesInformationDataObject,
      }
    }
    case AppActionTypes.SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT: {
      return {
        ...state,
        monthlyCasesInformationDataObject: action.casesInformationDataObject,
      }
    }
    case AppActionTypes.SET_YEARLY_CASES_INFORMATION_DATA_OBJECT: {
      return {
        ...state,
        yearlyCasesInformationDataObject: action.casesInformationDataObject,
      }
    }
    default:
      return state;
  }
};