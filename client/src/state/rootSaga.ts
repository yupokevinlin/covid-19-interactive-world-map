import { all } from "redux-saga/effects";
import AppSagas from "./global/App/sagas";
import HomePageSagas from "./containers/HomePageContainer/sagas";
import MapPageSagas from "./containers/MapPageContainer/sagas";
import ChartPageSagas from "./containers/ChartPageContainer/sagas";

function* rootSaga(): any {
  yield all({
    app: all({
      ...AppSagas,
    }),
    homePage: all({
      ...HomePageSagas,
    }),
    mapPage: all({
      ...MapPageSagas,
    }),
    chartPage: all({
      ...ChartPageSagas,
    }),
  });
}

export default rootSaga;
