import {Theme} from "@material-ui/core";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {CasesDataObject, CasesInformationDataObject} from "../../../../../shared/types/data/Cases/CasesTypes";


export interface AppState {
  isInitComplete: boolean;
  displayLoadingBar: boolean;
  displayLoadingPage: boolean;
  version: string;
  title: string;
  theme: Theme;
  page: Pages;
  subPage: SubPages;
  menuItems: Array<NavigationDrawerMenuItem>;
  dataTree: TreeItem;
  casesDataObject: CasesDataObject;
  dailyCasesInformationDataObject: CasesInformationDataObject;
  weeklyCasesInformationDataObject: CasesInformationDataObject;
  monthlyCasesInformationDataObject: CasesInformationDataObject;
  yearlyCasesInformationDataObject: CasesInformationDataObject;
}

export enum AppActionTypes {
  INIT = "app.INIT",
  SET_IS_INIT_COMPLETE = "app.SET_IS_INIT_COMPLETE",
  SET_IS_LOADING = "app.SET_IS_LOADING",
  SET_THEME = "app.SET_THEME",
  SET_VERSION = "app.SET_VERSION",
  SET_TITLE = "app.SET_TITLE",
  SET_PAGE = "app.SET_PAGE",
  SET_MENU_ITEMS = "app.SET_MENU_ITEMS",
  SET_DATA_TREE = "app.SET_DATA_TREE",
  SET_CASES_DATA_OBJECT = "app.SET_CASES_DATA_OBJECT",
  SET_DAILY_CASES_INFORMATION_DATA_OBJECT = "app.SET_DAILY_CASES_INFORMATION_DATA_OBJECT",
  SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT = "app.SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT",
  SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT = "app.SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT",
  SET_YEARLY_CASES_INFORMATION_DATA_OBJECT = "app.SET_YEARLY_CASES_INFORMATION_DATA_OBJECT",
  HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD = "app.HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD",
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
  CASES = "Cases",
  RECOVERIES = "Recoveries",
  DEATHS = "Deaths",
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
  DEFAULT = "#607d8b",
  HOME = "#3f51b5",
  MAP = "#ff5722",
  CHART = "#009688",
  UNUSED_1 = "#f44336",
  UNUSED_2 = "#9c27b0",
  UNUSED_3 = "#ffc107",
  UNUSED_4 = "#03a9f4",
  UNUSED_5 = "#e91e63",
  UNUSED_7 = "#4caf50",
  UNUSED_8 = "#673ab7",
  UNUSED_9 = "#9e9e9e",
  UNUSED_10 = "#795548",
}

export enum PageDarkColors {
  DEFAULT = "#435761",
  HOME = "#2c387e",
  MAP = "#b23c17",
  CHART = "#00695f",
  UNUSED_1 = "#aa2e25",
  UNUSED_2 = "#6d1b7b",
  UNUSED_3 = "#b28704",
  UNUSED_4 = "#0276aa",
  UNUSED_5 = "#a31545",
  UNUSED_7 = "#357a38",
  UNUSED_8 = "#482880",
  UNUSED_9 = "#6e6e6e",
  UNUSED_10 = "#543b32",
}

export enum PageLightColors {
  DEFAULT = "#7f97a2",
  HOME = "#6573c3",
  MAP = "#ff784e",
  CHART = "#33ab9f",
  UNUSED_1 = "#f6685e",
  UNUSED_2 = "#af52bf",
  UNUSED_3 = "#ffcd38",
  UNUSED_4 = "#35baf6",
  UNUSED_5 = "#ed4b82",
  UNUSED_7 = "#6fbf73",
  UNUSED_8 = "#8561c5",
  UNUSED_9 = "#b1b1b1",
  UNUSED_10 = "#93776c",
}

export enum PageBackgroundColors {
  DEFAULT = "#e7ecee",
  HOME = "#e2e5f4",
  MAP = "#ffe6de",
  CHART = "#d9efed",
  UNUSED_1 = "#fde3e1",
  UNUSED_2 = "#f0dff3",
  UNUSED_3 = "#fff6da",
  UNUSED_4 = "#d9f2fd",
  UNUSED_5 = "#fcdde8",
  UNUSED_7 = "#e4f3e5",
  UNUSED_8 = "#e8e1f4",
  UNUSED_9 = "#f0f0f0",
  UNUSED_10 = "#ebe6e4",
}

export enum CasesDataTypes {
  Total = "All Time",
  Daily = "Past Day",
  Weekly = "Past Week",
  Monthly = "Past Month",
  Yearly = "Past Year",
}

export enum CasesTypes {
  CASES = "Cases",
  RECOVERIES = "Recoveries",
  DEATHS = "Deaths",
}