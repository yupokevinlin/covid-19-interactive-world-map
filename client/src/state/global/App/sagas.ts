import {call, put, select, takeEvery} from "redux-saga/effects";
import {
  AppGoToPageAction,
  AppInitAction,
} from "./actions";
import {
  AppActionTypes,
  AppState, ChartSubPages, HomeSubPages, MapSubPages, PageBackgroundColors, PageColors, Pages, PageURLs, SubPages,
} from "./types";
import {Theme} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {History} from "history";
import {
  appBarHeightLg,
  appBarHeightMd,
  appBarHeightSm,
  appBarHeightXs
} from "../../../display/components/Navigation/Navigation";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";
import {MaterialIconNames} from "../../../display/components/MaterialIcon/MaterialIcon";
import {Utils} from "../../../helper/Utils";
import createDoubleMap = Utils.createDoubleMap;
import {Store} from "../../store";

export const appSagas = {
  initSaga: takeEvery(AppActionTypes.INIT, initSaga),
  goToPageSaga: takeEvery(AppActionTypes.GO_TO_PAGE, goToPageSaga),
};

function * initSaga(action: AppInitAction): any {
  const version: string = "0.0.1";
  yield put({
    type: AppActionTypes.SET_VERSION,
    version: version,
  });

  const theme: Theme = getInitialMaterialUITheme();
  yield put({
    type: AppActionTypes.SET_THEME,
    theme: theme,
  });

  yield put({
    type: AppActionTypes.SET_TITLE,
    page: Pages.HOME,
  });

  const menuItems: Array<NavigationDrawerMenuItem> = getInitialMenuItems();
  yield put({
    type: AppActionTypes.SET_MENU_ITEMS,
    menuItems: menuItems,
  });

  yield put({
    type: AppActionTypes.SET_IS_INIT_COMPLETE,
    isInitComplete: true,
  });
}

const getInitialMaterialUITheme = (): Theme => {
  let theme = createMuiTheme({
    palette: {
      primary: {
        light: "#6573c3",
        main: "#3f51b5",
        dark: "#2c387e",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff4569",
        main: "#ff1744",
        dark: "#b2102f",
        contrastText: "#fff",
      }
    },
    mixins: {
      toolbar: {
        minHeight: appBarHeightXs,
        ["@media (min-width:600px)"]: {
          minHeight: appBarHeightSm,
        },
        ["@media (min-width:960px)"]: {
          minHeight: appBarHeightMd,
        },
        ["@media (min-width:1280px)"]: {
          minHeight: appBarHeightLg
        },
      }
    }
  });
  theme = responsiveFontSizes(theme);
  return theme;
};

const getInitialMenuItems = (): Array<NavigationDrawerMenuItem> => {
  return [
    {
      text: Pages.HOME,
      toolTip: Pages.HOME,
      active: false,
      iconName: MaterialIconNames.Home,
      color: PageColors.HOME,
      backgroundColor: PageBackgroundColors.HOME,
      children: [
        {
          text: HomeSubPages.HOME,
          toolTip: HomeSubPages.HOME,
          iconName: MaterialIconNames.Home,
          active: false,
        },
      ],
    },
    {
      text: Pages.MAP,
      toolTip: Pages.MAP,
      active: false,
      iconName: MaterialIconNames.Map,
      color: PageColors.MAP,
      backgroundColor: PageBackgroundColors.MAP,
      children: [
        {
          text: MapSubPages.HOME,
          toolTip: MapSubPages.HOME,
          iconName: MaterialIconNames.Home,
          active: false,
        },
      ],
    },
    {
      text: Pages.CHART,
      toolTip: Pages.CHART,
      active: false,
      iconName: MaterialIconNames.BarChart,
      color: PageColors.CHART,
      backgroundColor: PageBackgroundColors.CHART,
      children: [
        {
          text: HomeSubPages.HOME,
          toolTip: HomeSubPages.HOME,
          iconName: MaterialIconNames.Home,
          active: false,
        },
      ],
    },
  ];
};

function * goToPageSaga(action: AppGoToPageAction): any {
  const appState: AppState = yield select(getAppStateSelector);
  const isSamePage: boolean = appState.page === action.page;
  const isRootPage: boolean = action.subPage === null;
  const defaultSubPage: SubPages = getDefaultSubPage(action.page);
  const redirectURL: PageURLs = getRedirectURL(action.page);

  if (isSamePage) {
    if (isRootPage) {
      yield put({
        type: AppActionTypes.SET_PAGE,
        page: action.page,
        subPage: defaultSubPage,
      });
    } else {
      yield put({
        type: AppActionTypes.SET_PAGE,
        page: action.page,
        subPage: action.subPage,
      });
    }
  } else {
    yield put({
      type: AppActionTypes.SET_IS_LOADING,
      isLoading: true,
    });
    if (action.page === Pages.MAP) {
      //destroyESRIMap();
    }
    redirect(redirectURL, action.history);
    if (isRootPage) {
      yield put({
        type: AppActionTypes.SET_PAGE,
        page: action.page,
        subPage: defaultSubPage,
      });
    } else {
      yield put({
        type: AppActionTypes.SET_PAGE,
        page: action.page,
        subPage: action.subPage,
      });
    }
    yield put({
      type: AppActionTypes.SET_THEME_COLOR,
      themeColor: getThemeColor(action.page),
    });
    yield put({
      type: AppActionTypes.SET_TITLE,
      page: action.page,
    });
  }

  const newMenuItems: Array<NavigationDrawerMenuItem> = getUpdatedMenuItems(action.page, action.subPage, appState.menuItems);
  yield put({
    type: AppActionTypes.SET_MENU_ITEMS,
    menuItems: newMenuItems,
  });
}

const pageToPageUrlRelation = createDoubleMap([
  [Pages.HOME, PageURLs.HOME],
  [Pages.MAP, PageURLs.MAP],
  [Pages.CHART, PageURLs.CHART],
]);

const getPage = (pathName: PageURLs): Pages => {
  return pageToPageUrlRelation[pathName];
};

const getRedirectURL = (page: Pages): PageURLs => {
  return pageToPageUrlRelation[page];
};

const redirect = (url: PageURLs, history: History): void => {
  history.push(url);
};

const getDefaultSubPage = (page: Pages): SubPages => {
  let newSubPage: SubPages = null;
  switch (page) {
    case Pages.HOME: {
      newSubPage = HomeSubPages.HOME;
      break;
    }
    case Pages.MAP: {
      newSubPage = MapSubPages.HOME;
      break;
    }
    case Pages.CHART: {
      newSubPage = ChartSubPages.HOME;
      break;
    }
  }
  return newSubPage;
};

const getThemeColor = (page: Pages): string => {
  switch (page) {
    case Pages.HOME: {
      return PageColors.HOME;
    }
    case Pages.MAP: {
      return PageColors.MAP;
    }
    case Pages.CHART: {
      return PageColors.CHART;
    }
    default: {
      return PageColors.HOME;
    }
  }
};

const getUpdatedMenuItems = (page: Pages, subPage: SubPages, menuItems: Array<NavigationDrawerMenuItem>): Array<NavigationDrawerMenuItem> => {
  return menuItems.map((menuItem) => {
    if (menuItem.text === page) {
      if (subPage === null) {
        const newSubPage: SubPages = getDefaultSubPage(page);
        if (newSubPage === null) {
          return {
            ...menuItem,
            active: true,
          }
        } else {
          return {
            ...menuItem,
            active: true,
            children: menuItem.children.map(child => {
              if (child.text === newSubPage) {
                return {
                  ...child,
                  active: true,
                }
              } else {
                return {
                  ...child,
                  active: false,
                }
              }
            })
          }
        }
      } else {
        return {
          ...menuItem,
          active: true,
          children: menuItem.children.map(child => {
            if (child.text === subPage) {
              return {
                ...child,
                active: true,
              }
            } else {
              return {
                ...child,
                active: false,
              }
            }
          })
        }
      }
    } else {
      return {
        ...menuItem,
        active: false,
        children: menuItem.children.map(child => ({
          ...child,
          active: false,
        }))
      }
    }
  })
};

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default appSagas;
