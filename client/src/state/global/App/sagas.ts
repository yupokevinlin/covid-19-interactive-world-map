import {call, put, select, takeEvery, delay} from "redux-saga/effects";
import {
  AppGoToPageAction, AppHandleStartCasesInformationDataObjectLoadAction,
  AppInitAction, AppSetIsLoadingDelayedAction,
} from "./actions";
import {
  AppActionTypes,
  AppState, CasesDataTypes,
  ChartSubPages,
  HomeSubPages,
  MapSubPages,
  PageBackgroundColors,
  PageColors, PageDarkColors,
  PageLightColors,
  Pages,
  PageURLs,
  SubPages,
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
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {TreeApi} from "../../../api/TreeApi/TreeApi";
import {destroyESRIMap} from "../../../display/components/ESRIMap/ESRIMap";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {AppStore} from "../../../app/App";
import {MapPageActionTypes} from "../../containers/MapPageContainer/types";
import {CasesInformationDataObject, CurrentCasesSummary} from "../../../../../shared/types/data/Cases/CasesTypes";
import {ChartPageActionTypes} from "../../containers/ChartPageContainer/types";
import {HomePageActionTypes} from "../../containers/HomePageContainer/types";

export const appSagas = {
  initSaga: takeEvery(AppActionTypes.INIT, initSaga),
  setIsLoadingDelayedSaga: takeEvery(AppActionTypes.SET_IS_LOADING_DELAYED, setIsLoadingDelayedSaga),
  handleStartCasesInformationDataObjectLoadSaga: takeEvery(AppActionTypes.HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD, handleStartCasesInformationDataObjectLoadSaga),
  goToPageSaga: takeEvery(AppActionTypes.GO_TO_PAGE, goToPageSaga),
};

function * initSaga(action: AppInitAction): any {
  getCasesDataObject();
  const version: string = "1.0.0";
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

  const dataTree: TreeItem = yield call(TreeApi.getTree);
  yield put({
    type: AppActionTypes.SET_DATA_TREE,
    dataTree: dataTree,
  });

  const summaryData: CurrentCasesSummary = yield call(CasesApi.getSummaryData);
  yield put({
    type: HomePageActionTypes.SET_SUMMARY_DATA,
    summaryData: summaryData,
  });

  yield put({
    type: AppActionTypes.SET_IS_INIT_COMPLETE,
    isInitComplete: true,
  });
}

const getCasesDataObject = (): void => {
  CasesApi.getAllCasesData().then((casesDataObject) => {
    AppStore.store.dispatch({
      type: AppActionTypes.SET_CASES_DATA_OBJECT,
      casesDataObject: casesDataObject,
    });
    const store: Store = AppStore.store.getState();
    if (store.app.page === Pages.MAP) {
      if (!store.mapPage.initComplete) {
        AppStore.store.dispatch({
          type: MapPageActionTypes.INIT,
        });
      }
      return;
    }
    if (store.app.page === Pages.CHART) {
      if (!store.chartPage.initComplete) {
        AppStore.store.dispatch({
          type: ChartPageActionTypes.INIT,
        });
      }
    }
    AppStore.store.dispatch({
      type: AppActionTypes.SET_IS_LOADING,
      displayLoadingBar: false,
      displayLoadingPage: false,
    });
  });
};

const getInitialMaterialUITheme = (): Theme => {
  let theme = createMuiTheme({
    palette: {
      primary: {
        light: PageLightColors.HOME,
        main: PageColors.HOME,
        dark: PageDarkColors.HOME,
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
          text: HomeSubPages.SUMMARY,
          toolTip: HomeSubPages.SUMMARY,
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
          text: MapSubPages.CASES,
          toolTip: MapSubPages.CASES,
          iconName: MaterialIconNames.LocalHospital,
          active: false,
        },
        {
          text: MapSubPages.DEATHS,
          toolTip: MapSubPages.DEATHS,
          iconName: MaterialIconNames.Skull,
          active: false,
        },
        {
          text: MapSubPages.RECOVERIES,
          toolTip: MapSubPages.RECOVERIES,
          iconName: MaterialIconNames.AssignmentTurnedIn,
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
          text: ChartSubPages.CASES,
          toolTip: ChartSubPages.CASES,
          iconName: MaterialIconNames.LocalHospital,
          active: false,
        },
        {
          text: ChartSubPages.DEATHS,
          toolTip: ChartSubPages.DEATHS,
          iconName: MaterialIconNames.Skull,
          active: false,
        },
        {
          text: ChartSubPages.RECOVERIES,
          toolTip: ChartSubPages.RECOVERIES,
          iconName: MaterialIconNames.AssignmentTurnedIn,
          active: false,
        },
      ],
    },
  ];
};

function * setIsLoadingDelayedSaga(action: AppSetIsLoadingDelayedAction): any {
  yield delay(action.delay);
  const appState: AppState = yield select(getAppStateSelector);
  if (appState.isDoingNetworkCall) {
    yield put({
      type: AppActionTypes.SET_IS_LOADING,
      displayLoadingBar: action.displayLoadingBar,
      displayLoadingPage: action.displayLoadingPage,
    });
  }
}

function * handleStartCasesInformationDataObjectLoadSaga(action: AppHandleStartCasesInformationDataObjectLoadAction): any {
  switch (action.casesDataType) {
    case CasesDataTypes.Daily: {
      const casesInformationDataObject: CasesInformationDataObject = yield call(CasesApi.getAllDailyCasesInformationData);
      yield put({
        type: AppActionTypes.SET_DAILY_CASES_INFORMATION_DATA_OBJECT,
        casesInformationDataObject: casesInformationDataObject,
      });
      break;
    }
    case CasesDataTypes.Weekly: {
      const casesInformationDataObject: CasesInformationDataObject = yield call(CasesApi.getAllWeeklyCasesInformationData);
      yield put({
        type: AppActionTypes.SET_WEEKLY_CASES_INFORMATION_DATA_OBJECT,
        casesInformationDataObject: casesInformationDataObject,
      });
      break;
    }
    case CasesDataTypes.Monthly: {
      const casesInformationDataObject: CasesInformationDataObject = yield call(CasesApi.getAllMonthlyCasesInformationData);
      yield put({
        type: AppActionTypes.SET_MONTHLY_CASES_INFORMATION_DATA_OBJECT,
        casesInformationDataObject: casesInformationDataObject,
      });
      break;
    }
    case CasesDataTypes.Yearly: {
      const casesInformationDataObject: CasesInformationDataObject = yield call(CasesApi.getAllYearlyCasesInformationData);
      yield put({
        type: AppActionTypes.SET_YEARLY_CASES_INFORMATION_DATA_OBJECT,
        casesInformationDataObject: casesInformationDataObject,
      });
      break;
    }
  }
}

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
      displayLoadingBar: true,
      displayLoadingPage: true,
    });
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
      type: AppActionTypes.SET_THEME,
      theme: getPageColorTheme(action.page, appState.theme),
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

export const getDefaultSubPage = (page: Pages): SubPages => {
  let newSubPage: SubPages = null;
  switch (page) {
    case Pages.HOME: {
      newSubPage = HomeSubPages.SUMMARY;
      break;
    }
    case Pages.MAP: {
      newSubPage = MapSubPages.CASES;
      break;
    }
    case Pages.CHART: {
      newSubPage = ChartSubPages.CASES;
      break;
    }
  }
  return newSubPage;
};

export const getPageColorTheme = (page: Pages, theme: Theme): Theme => {
  switch (page) {
    case Pages.HOME: {
      return {
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            light: PageLightColors.HOME,
            main: PageColors.HOME,
            dark: PageDarkColors.HOME,
            contrastText: "#fff",
          }
        }
      }
    }
    case Pages.MAP: {
      return {
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            light: PageLightColors.MAP,
            main: PageColors.MAP,
            dark: PageDarkColors.MAP,
            contrastText: "#fff",
          }
        }
      }
    }
    case Pages.CHART: {
      return {
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            light: PageLightColors.CHART,
            main: PageColors.CHART,
            dark: PageDarkColors.CHART,
            contrastText: "#fff",
          }
        }
      }
    }
    default: {
      return {
        ...theme,
        palette: {
          ...theme.palette,
          primary: {
            light: PageLightColors.DEFAULT,
            main: PageColors.DEFAULT,
            dark: PageDarkColors.DEFAULT,
            contrastText: "#fff",
          }
        }
      }
    }
  }
};

export const getUpdatedMenuItems = (page: Pages, subPage: SubPages, menuItems: Array<NavigationDrawerMenuItem>): Array<NavigationDrawerMenuItem> => {
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
