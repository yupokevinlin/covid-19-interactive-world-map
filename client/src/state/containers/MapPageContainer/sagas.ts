import {call, put, select, takeEvery, all} from "redux-saga/effects";
import {MapPageActionTypes} from "./types";
import {MapPageInitAction} from "./actions";
import {AppActionTypes} from "../../global/App/types";
import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {MapApi} from "../../../api/MapApi/MapApi";
import {ESRIMapPolygon} from "../../../display/components/ESRIMap/ESRIMap";
import {CasesData} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {DateUtils} from "../../../helper/DateUtils";

export const mapPageSagas = {
  initSaga: takeEvery(MapPageActionTypes.INIT, initSaga),
};

function * initSaga(action: MapPageInitAction): any {
  const mapPolygons: Array<MapPolygon> = yield call(MapApi.getMapLayer0Data);
  const hierarchicalNames: Array<string> = mapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
  const casesDataArray: Array<CasesData> = yield all(hierarchicalNames.map((hierarchicalName) => call(CasesApi.getCasesData, hierarchicalName)));
  const esriMapPolygons: Array<ESRIMapPolygon> = mapPolygons.map((mapPolygon, index) => {
    const caseData: CasesData = casesDataArray[index];
    return {
      ...mapPolygon,
      ...caseData,
    }

  });
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: esriMapPolygons,
  });

  const dateValues: Array<string> = DateUtils.getDateStringArray("1/1/20", DateUtils.getCurrentDate());
  yield put({
    type: MapPageActionTypes.SET_DATE_VALUES,
    dateValues: dateValues,
  });

  yield put({
    type: AppActionTypes.SET_IS_LOADING,
    isLoading: false,
  });
}

export default mapPageSagas;