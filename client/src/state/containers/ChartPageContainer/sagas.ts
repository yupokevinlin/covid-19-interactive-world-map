import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {ChartPageActionTypes} from "./types";
import {ChartPageHandleBreadcrumbsRegionChangeAction, ChartPageInitAction} from "./actions";
import {AppActionTypes, AppState} from "../../global/App/types";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {CasesDataObject} from "../../../../../shared/types/data/Cases/CasesTypes";
import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {MapApi} from "../../../api/MapApi/MapApi";
import {getNameArray, getSequentialHierarchicalNames, getTreeItem} from "../../../../../shared/helpers/General";
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
  yield put({
    type: AppActionTypes.SET_IS_LOADING,
    displayLoadingBar: true,
    displayLoadingPage: false,
  });
  const layer0MapPolygons: Array<MapPolygon> = yield call(MapApi.getMapLayer0Data);
  if (action.hierarchicalName === "World") {
    yield put({
      type: ChartPageActionTypes.SET_COUNTRY_CODE,
      countryCode: "World",
    });
  } else {
    const sequentialHierarchicalNames: Array<string> = getSequentialHierarchicalNames(action.hierarchicalName);
    const layer0HierarchicalName: string = sequentialHierarchicalNames[1];
    const layer0MatchingPolygon: MapPolygon = layer0MapPolygons.find((mapPolygon) => mapPolygon.hierarchicalName === layer0HierarchicalName);
    yield put({
      type: ChartPageActionTypes.SET_COUNTRY_CODE,
      countryCode: layer0MatchingPolygon.countryCode,
    });
  }
  yield put({
    type: AppActionTypes.SET_IS_LOADING,
    displayLoadingBar: false,
    displayLoadingPage: false,
  });
}

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default chartPageSagas;