import { all } from "redux-saga/effects";
import AppSagas from "./global/App/sagas";
import MapPageSagas from "./containers/MapPageContainer/sagas";

function* rootSaga(): any {
  yield all({
    app: all({
      ...AppSagas,
    }),
    mapPage: all({
      ...MapPageSagas,
    }),
  });
}

export default rootSaga;
