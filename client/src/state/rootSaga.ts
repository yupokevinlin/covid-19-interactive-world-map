import { all } from "redux-saga/effects";
import MapPageContainerSagas from "./containers/MapPageContainer/sagas";

function* rootSaga(): any {
  yield all({
    ...MapPageContainerSagas,
  });
}

export default rootSaga;
