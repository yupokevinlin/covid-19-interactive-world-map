import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {ChartPageActionTypes} from "./types";
import {ChartPageInitAction} from "./actions";

export const chartPageSagas = {
  initSaga: takeEvery(ChartPageActionTypes.INIT, initSaga),
}

function * initSaga(action: ChartPageInitAction): any {
  yield put({
    type: ChartPageActionTypes.SET_INIT_COMPLETE,
    initComplete: true,
  });
}

export default chartPageSagas;