import {AppActionTypes, Pages, SubPages} from "./types";
import {Theme} from "@material-ui/core";
import {History} from "history";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";

export type AppAction = AppInitAction
| AppSetIsInitCompleteAction
| AppSetIsLoadingAction
| AppSetThemeAction
| AppSetThemeColorAction
| AppSetTitleAction
| AppSetVersionAction
| AppSetPageAction
| AppSetMenuItemsAction
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
  isLoading: boolean;
}
export const setIsLoading = (isLoading: boolean): AppSetIsLoadingAction => {
  return {
    type: AppActionTypes.SET_IS_LOADING,
    isLoading: isLoading,
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

export interface AppSetThemeColorAction {
  type: typeof AppActionTypes.SET_THEME_COLOR;
  themeColor: string;
}
export const setThemeColor = (themeColor: string): AppSetThemeColorAction => {
  return {
    type: AppActionTypes.SET_THEME_COLOR,
    themeColor: themeColor,
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
