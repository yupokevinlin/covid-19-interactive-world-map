import {Theme} from "@material-ui/core";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";


export interface AppState {
  isInitComplete: boolean;
  isLoading: boolean;
  version: string;
  title: string;
  theme: Theme;
  themeColor: string;
  page: Pages;
  subPage: SubPages;
  menuItems: Array<NavigationDrawerMenuItem>;
}

export enum AppActionTypes {
  INIT = "app.INIT",
  SET_IS_INIT_COMPLETE = "app.SET_IS_INIT_COMPLETE",
  SET_IS_LOADING = "app.SET_IS_LOADING",
  SET_THEME = "app.SET_THEME",
  SET_THEME_COLOR = "app.SET_THEME_COLOR",
  SET_VERSION = "app.SET_VERSION",
  SET_TITLE = "app.SET_TITLE",
  SET_PAGE = "app.SET_PAGE",
  SET_MENU_ITEMS = "app.SET_MENU_ITEMS",
  GO_TO_PAGE = "app.GO_TO_PAGE",
}

export enum Pages {
  HOME = "Home",
  MAP = "Map",
  CHART = "Chart",
}

export type SubPages = HomeSubPages | MapSubPages | ChartSubPages;

export enum HomeSubPages {
  HOME = "Home"
}

export enum MapSubPages {
  HOME = "Home"
}

export enum ChartSubPages {
  HOME = "Home"
}

export enum PageURLs {
  HOME = "/",
  MAP = "/map",
  CHART = "/chart",
}

export enum PageColors {
  HOME = "#3f51b5",
  MAP = "#ff5722",
  CHART = "#009688",
  UNUSED_1 = "#f44336",
  UNUSED_2 = "#9c27b0",
  UNUSED_3 = "#ffc107",
  UNUSED_4 = "#03a9f4",
  UNUSED_5 = "#e91e63",
  UNUSED_6 = "#607d8b",
  UNUSED_7 = "#4caf50",
  UNUSED_8 = "#673ab7",
  UNUSED_9 = "#9e9e9e",
  UNUSED_10 = "#795548",
}

export enum PageBackgroundColors {
  HOME = "#e2e5f4",
  MAP = "#ffe6de",
  CHART = "#d9efed",
  UNUSED_1 = "#fde3e1",
  UNUSED_2 = "#f0dff3",
  UNUSED_3 = "#fff6da",
  UNUSED_4 = "#d9f2fd",
  UNUSED_5 = "#fcdde8",
  UNUSED_6 = "#e7ecee",
  UNUSED_7 = "#e4f3e5",
  UNUSED_8 = "#e8e1f4",
  UNUSED_9 = "#f0f0f0",
  UNUSED_10 = "#ebe6e4",
}
