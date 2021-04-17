import {AppActionTypes, Pages, SubPages} from "./types";
import {Theme} from "@material-ui/core";
import {History} from "history";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";

export type AppAction = AppInitAction
| AppSetIsInitCompleteAction
| AppSetIsLoadingAction
| AppSetThemeAction
| AppSetTitleAction
| AppSetVersionAction
| AppSetPageAction
| AppSetMenuItemsAction
| AppSetDataTreeAction
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
