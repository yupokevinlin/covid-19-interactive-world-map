import { all } from "redux-saga/effects";
import AppSagas from "./global/App/sagas";
import MapPageSagas from "./containers/MapPageContainer/sagas";
import chartPageSagas from "./containers/ChartPageContainer/sagas";

function* rootSaga(): any {
  yield all({
    app: all({
      ...AppSagas,
    }),
    mapPage: all({
      ...MapPageSagas,
    }),
    chartPage: all({
      ...chartPageSagas,
    }),
  });
}

export default rootSaga;
