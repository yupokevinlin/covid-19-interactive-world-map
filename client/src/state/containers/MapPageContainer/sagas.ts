import {call, put, select, takeEvery, all} from "redux-saga/effects";
import {MapPageActionTypes} from "./types";
import {MapPageHandleRegionChangeAction, MapPageInitAction} from "./actions";
import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {MapApi} from "../../../api/MapApi/MapApi";
import {CasesData, CasesDataObject} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {DateUtils} from "../../../helper/DateUtils";
import {ESRIMapPolygon} from "../../../display/components/ESRIMap/types";
import {getSequentialHierarchicalNames} from "../../../../../shared/helpers/General";
import {Store} from "../../store";
import {AppState} from "../../global/App/types";

export const mapPageSagas = {
  initSaga: takeEvery(MapPageActionTypes.INIT, initSaga),
  handleRegionChange: takeEvery(MapPageActionTypes.HANDLE_REGION_CHANGE, handleRegionChange),
};

function * initSaga(action: MapPageInitAction): any {
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: [],
  });
  const appState: AppState = yield select(getAppStateSelector);
  const casesDataObject: CasesDataObject = appState.casesDataObject;
  const layer0MapPolygons: Array<MapPolygon> = yield call(MapApi.getMapLayer0Data);
  const hierarchicalNames: Array<string> = layer0MapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
  const casesData: Array<CasesData> = getCasesDataByHierarchicalNames(casesDataObject, hierarchicalNames);
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: getESRIMapPolygons(layer0MapPolygons, casesData),
  });

  const dateValues: Array<string> = DateUtils.getDateStringArray("1/1/20", DateUtils.getCurrentDate());
  yield put({
    type: MapPageActionTypes.SET_DATE_VALUES,
    dateValues: dateValues,
  });
}

function * handleRegionChange(action: MapPageHandleRegionChangeAction): any {
  const appState: AppState = yield select(getAppStateSelector);
  const casesDataObject: CasesDataObject = appState.casesDataObject;
  const layer0MapPolygons: Array<MapPolygon> = yield call(MapApi.getMapLayer0Data);
  if (action.hierarchicalName === "World") {
    const hierarchicalNames: Array<string> = layer0MapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
    const casesData: Array<CasesData> = getCasesDataByHierarchicalNames(casesDataObject, hierarchicalNames);
    yield put({
      type: MapPageActionTypes.SET_MAP_POLYGONS,
      mapPolygons: getESRIMapPolygons(layer0MapPolygons, casesData),
    });
  } else {
    let filteredMapPolygons: Array<MapPolygon> = layer0MapPolygons;
    const sequentialHierarchicalNames: Array<string> = getSequentialHierarchicalNames(action.hierarchicalName);
    if (sequentialHierarchicalNames.length === 2) {
      const layer1HierarchicalName: string = sequentialHierarchicalNames[1];
      const layer1MapPolygons: Array<MapPolygon> = yield call(MapApi.getMapLayer1Data, layer1HierarchicalName);
      filteredMapPolygons.push(...layer1MapPolygons);
      filteredMapPolygons = filteredMapPolygons.filter((mapPolygon) => mapPolygon.hierarchicalName !== layer1HierarchicalName);
      const hierarchicalNames: Array<string> = filteredMapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
      const casesData: Array<CasesData> = getCasesDataByHierarchicalNames(casesDataObject, hierarchicalNames);
      yield put({
        type: MapPageActionTypes.SET_MAP_POLYGONS,
        mapPolygons: getESRIMapPolygons(filteredMapPolygons, casesData),
      });
    } else if (sequentialHierarchicalNames.length === 3) {
      const layer1HierarchicalName: string = sequentialHierarchicalNames[1];
      const layer2HierarchicalName: string = sequentialHierarchicalNames[2];
      const layersPromises: Array<Promise<Array<MapPolygon>>> = [
        MapApi.getMapLayer1Data(layer1HierarchicalName),
        MapApi.getMapLayer2Data(layer2HierarchicalName),
      ];
      const layersMapPolygonsData: Array<Array<MapPolygon>> = yield all(layersPromises);
      filteredMapPolygons.push(...layersMapPolygonsData[0], ...layersMapPolygonsData[1]);
      filteredMapPolygons = filteredMapPolygons.filter((mapPolygon) => mapPolygon.hierarchicalName !== layer1HierarchicalName && mapPolygon.hierarchicalName !== layer2HierarchicalName);
      const hierarchicalNames: Array<string> = filteredMapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
      const casesData: Array<CasesData> = getCasesDataByHierarchicalNames(casesDataObject, hierarchicalNames);
      yield put({
        type: MapPageActionTypes.SET_MAP_POLYGONS,
        mapPolygons: getESRIMapPolygons(filteredMapPolygons, casesData),
      });
    }
  }
}

const getESRIMapPolygons = (mapPolygons: Array<MapPolygon>, casesData: Array<CasesData>): Array<ESRIMapPolygon> => {
  return mapPolygons.map((mapPolygon, index) => {
    const caseData: CasesData = casesData[index];
    return {
      ...mapPolygon,
      ...caseData,
    }
  });
};

export const getCasesDataByHierarchicalNames = (casesDataObject: CasesDataObject, hierarchicalNames: Array<string>): Array<CasesData | undefined> => {
  return hierarchicalNames.map((hierarchicalName) => casesDataObject[hierarchicalName]);
};

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default mapPageSagas;