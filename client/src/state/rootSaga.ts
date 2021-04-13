import { all } from "redux-saga/effects";
import AppSagas from "./global/App/sagas";

function* rootSaga(): any {
  yield all({
    ...AppSagas,
  });
}

export default rootSaga;
