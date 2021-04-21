import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {ChartPageActionTypes} from "./types";
import {ChartPageInitAction} from "./actions";
import {AppActionTypes} from "../../global/App/types";

export const chartPageSagas = {
  initSaga: takeEvery(ChartPageActionTypes.INIT, initSaga),
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

export default chartPageSagas;