import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {ChartPageActionTypes} from "./types";
import {ChartPageHandleBreadcrumbsRegionChangeAction, ChartPageInitAction} from "./actions";
import {AppActionTypes, AppState} from "../../global/App/types";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {getSequentialHierarchicalNames, getTreeItem} from "../../../../../shared/helpers/General";
import {Store} from "../../store";

export const chartPageSagas = {
  initSaga: takeEvery(ChartPageActionTypes.INIT, initSaga),
  handleBreadcrumbsRegionChange: takeEvery(ChartPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE, handleBreadcrumbsRegionChange),
}

function * initSaga(action: ChartPageInitAction): any {
  yield put({
    type: ChartPageActionTypes.SET_INIT_COMPLETE,
    initComplete: true,
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