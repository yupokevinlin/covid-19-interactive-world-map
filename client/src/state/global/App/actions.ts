import {AppActionTypes, CasesDataTypes, Pages, SubPages} from "./types";
import {Theme} from "@material-ui/core";
import {History} from "history";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {CasesDataObject, CasesInformationDataObject} from "../../../../../shared/types/data/Cases/CasesTypes";

export type AppAction = AppInitAction
| AppSetIsInitCompleteAction
| AppSetIsLoadingAction
| AppSetIsLoadingDelayedAction
| AppSetIsDoingNetworkCallAction
| AppSetThemeAction
| AppSetTitleAction
| AppSetVersionAction
| AppSetPageAction
| AppSetMenuItemsAction
| AppSetDataTreeAction
| AppSetCasesDataObjectAction
| AppSetDailyCasesInformationDataObjectAction
| AppSetWeeklyCasesInformationDataObjectAction
| AppSetMonthlyCasesInformationDataObjectAction
| AppSetYearlyCasesInformationDataObjectAction
| AppHandleStartCasesInformationDataObjectLoadAction
| AppGoToPageAction;

export interface AppInitAction {
  type: typeof AppActionTypes.INIT;
}
export const init = (): AppInitAction => {
  return {
    type: AppActionTypes.INIT,
  };
};

export interface AppSetIsInitCompleteAction {
  type: typeof AppActionTypes.SET_IS_INIT_COMPLETE;
  isInitComplete: boolean;
}
export const setIsInitComplete = (isInitComplete: boolean): AppSetIsInitCompleteAction => {
  return {
    type: AppActionTypes.SET_IS_INIT_COMPLETE,
    isInitComplete: isInitComplete,
  };
};

export interface AppSetIsLoadingAction {
  type: typeof AppActionTypes.SET_IS_LOADING;
  displayLoadingBar: boolean;
  displayLoadingPage: boolean;
}
export const setIsLoading = (displayLoadingBar: boolean, displayLoadingPage: boolean): AppSetIsLoadingAction => {
  return {
    type: AppActionTypes.SET_IS_LOADING,
    displayLoadingBar: displayLoadingBar,
    displayLoadingPage: displayLoadingPage,
  };
};

export interface AppSetIsLoadingDelayedAction {
  type: typeof AppActionTypes.SET_IS_LOADING_DELAYED;
  delay: number;
  displayLoadingBar: boolean;
  displayLoadingPage: boolean;
}
export const setIsLoadingDelayed = (delay: number, displayLoadingBar: boolean, displayLoadingPage: boolean): AppSetIsLoadingDelayedAction => {
  return {
    type: AppActionTypes.SET_IS_LOADING_DELAYED,
    delay: delay,
    displayLoadingBar: displayLoadingBar,
    displayLoadingPage: displayLoadingPage,
  };
};

export interface AppSetIsDoingNetworkCallAction {
  type: typeof AppActionTypes.SET_IS_DOING_NETWORK_CALL;
  isDoingNetworkCall: boolean;
}
export const setIsDoingNetworkCall = (isDoingNetworkCall: boolean): AppSetIsDoingNetworkCallAction => {
  return {
    type: AppActionTypes.SET_IS_DOING_NETWORK_CALL,
    isDoingNetworkCall: isDoingNetworkCall,
  };
};

export interface AppSetThemeAction {
  type: typeof AppActionTypes.SET_THEME;
  theme: Theme;
}
export const setTheme = (theme: Theme): AppSetThemeAction => {
  return {
    type: AppActionTypes.SET_THEME,
    theme: theme,
  };
};

export interface AppSetTitleAction {
  type: typeof AppActionTypes.SET_TITLE;
  page: Pages;
}
export const setTitle = (page: Pages): AppSetTitleAction => {
  return {
    type: AppActionTypes.SET_TITLE,
    page: page,
  };
};

export interface AppSetVersionAction {
  type: typeof AppActionTypes.SET_VERSION;
  version: string;
}
export const setVersion = (version: string): AppSetVersionAction => {
  return {
    type: AppActionTypes.SET_VERSION,
    version: version,
  };
};

export interface AppSetPageAction {
  type: typeof AppActionTypes.SET_PAGE;
  page: Pages;
  subPage: SubPages;
}
export const setPage = (page: Pages, subPage: SubPages): AppSetPageAction => {
  return {
    type: AppActionTypes.SET_PAGE,
    page: page,
    subPage: subPage,
  };
};

export interface AppSetMenuItemsAction {
  type: typeof AppActionTypes.SET_MENU_ITEMS;
  menuItems: Array<NavigationDrawerMenuItem>;
}
export const setMenuItems = (menuItems: Array<NavigationDrawerMenuItem>): AppSetMenuItemsAction => {
  return {
    type: AppActionTypes.SET_MENU_ITEMS,
    menuItems: menuItems,
  };
};

export interface AppSetDataTreeAction {
  type: typeof AppActionTypes.SET_DATA_TREE;
  dataTree: TreeItem;
}
export const setDataTree = (dataTree: TreeItem): AppSetDataTreeAction => {
  return {
    type: AppActionTypes.SET_DATA_TREE,
    dataTree: dataTree,
  };
};

export interface AppSetCasesDataObjectAction {
  type: typeof AppActionTypes.SET_CASES_DATA_OBJECT;
  casesDataObject: CasesDataObject;
}
export const setCasesDataObject = (casesDataObject: CasesDataObject): AppSetCasesDataObjectAction => {
  return {
    type: AppActionTypes.SET_CASES_DATA_OBJECT,
    casesDataObject: casesDataObject,
  };
};

export interface AppSetDailyCasesInformationDataObjectAction {
  type: typeof AppActionTypes.SET_DAILY_CASES_INFORMATION_DATA_OBJECT;
  casesInformationDataObject: CasesInformationDataObject;

}
export const setDailyCasesInformationDataObject = (casesInformationDataObject: CasesInformationDataObject): AppSetDailyCasesInformationDataObjectAction => {
  return {
    type: AppActionTypes.SET_DAILY_CASES_INFORMATION_DATA_OBJECT,
    casesInformationDataObject: casesInformationDataObject,
  };
};

export interface AppSetWeeklyCasesInformationDataObjectAction {
  type: typeof AppActionTypes.SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT;
  casesInformationDataObject: CasesInformationDataObject;

}
export const setWeeklyCasesInformationDataObject = (casesInformationDataObject: CasesInformationDataObject): AppSetWeeklyCasesInformationDataObjectAction => {
  return {
    type: AppActionTypes.SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT,
    casesInformationDataObject: casesInformationDataObject,
  };
};

export interface AppSetMonthlyCasesInformationDataObjectAction {
  type: typeof AppActionTypes.SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT;
  casesInformationDataObject: CasesInformationDataObject;

}
export const setMonthlyCasesInformationDataObject = (casesInformationDataObject: CasesInformationDataObject): AppSetMonthlyCasesInformationDataObjectAction => {
  return {
    type: AppActionTypes.SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT,
    casesInformationDataObject: casesInformationDataObject,
  };
};

export interface AppSetYearlyCasesInformationDataObjectAction {
  type: typeof AppActionTypes.SET_YEARLY_CASES_INFORMATION_DATA_OBJECT;
  casesInformationDataObject: CasesInformationDataObject;

}
export const setYearlyCasesInformationDataObject = (casesInformationDataObject: CasesInformationDataObject): AppSetYearlyCasesInformationDataObjectAction => {
  return {
    type: AppActionTypes.SET_YEARLY_CASES_INFORMATION_DATA_OBJECT,
    casesInformationDataObject: casesInformationDataObject,
  };
};

export interface AppHandleStartCasesInformationDataObjectLoadAction {
  type: typeof AppActionTypes.HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD;
  casesDataType: CasesDataTypes;
}
export const handleStartCasesInformationDataObjectLoad = (casesDataType: CasesDataTypes): AppHandleStartCasesInformationDataObjectLoadAction => {
  return {
    type: AppActionTypes.HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD,
    casesDataType: casesDataType,
  };
};

export interface AppGoToPageAction {
  type: typeof AppActionTypes.GO_TO_PAGE;
  page: Pages;
  subPage: SubPages;
  history: History;
}
export const goToPage = (page: Pages, subPage: SubPages, history: History): AppGoToPageAction => {
  return {
    type: AppActionTypes.GO_TO_PAGE,
    page: page,
    subPage: subPage,
    history: history,
  };
};
