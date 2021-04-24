import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {ChartPageActionTypes} from "./types";
import {ChartPageHandleBreadcrumbsRegionChangeAction, ChartPageInitAction} from "./actions";
import {AppActionTypes, AppState, Pages, SubPages} from "../../global/App/types";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {getSequentialHierarchicalNames, getTreeItem} from "../../../../../shared/helpers/General";
import {Store} from "../../store";
import {getDefaultSubPage, getPageColorTheme, getUpdatedMenuItems} from "../../global/App/sagas";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";

export const chartPageSagas = {
  initSaga: takeEvery(ChartPageActionTypes.INIT, initSaga),
  handleBreadcrumbsRegionChange: takeEvery(ChartPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE, handleBreadcrumbsRegionChange),
}

function * initSaga(action: ChartPageInitAction): any {
  const appState: AppState = yield select(getAppStateSelector);
  yield put({
    type: ChartPageActionTypes.SET_INIT_COMPLETE,
    initComplete: true,
  });
  const defaultSubPage: SubPages = getDefaultSubPage(Pages.CHART);
  yield put({
    type: AppActionTypes.SET_PAGE,
    page: Pages.CHART,
    subPage: defaultSubPage,
  });
  yield put({
    type: AppActionTypes.SET_THEME,
    theme: getPageColorTheme(Pages.CHART, appState.theme),
  });
  const newMenuItems: Array<NavigationDrawerMenuItem> = getUpdatedMenuItems(Pages.CHART, defaultSubPage, appState.menuItems);
  yield put({
    type: AppActionTypes.SET_MENU_ITEMS,
    menuItems: newMenuItems,
  });
  yield put({
    type: ChartPageActionTypes.SET_COUNTRY_CODE,
    countryCode: "World",
  });
  yield put({
    type: AppActionTypes.SET_IS_LOADING,
    displayLoadingBar: false,
    displayLoadingPage: false,
  });
}

function * handleBreadcrumbsRegionChange(action: ChartPageHandleBreadcrumbsRegionChangeAction): any {
  if (action.hierarchicalName === "World") {
    yield put({
      type: ChartPageActionTypes.SET_COUNTRY_CODE,
      countryCode: "World",
    });
  } else {
    const sequentialHierarchicalNames: Array<string> = getSequentialHierarchicalNames(action.hierarchicalName);
    const layer0HierarchicalName: string = sequentialHierarchicalNames[1];
    const appState: AppState = yield select(getAppStateSelector);
    const treeItem: TreeItem = getTreeItem(appState.dataTree, layer0HierarchicalName);
    yield put({
      type: ChartPageActionTypes.SET_COUNTRY_CODE,
      countryCode: treeItem?.countryCode || "",
    });
  }
}

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default chartPageSagas;