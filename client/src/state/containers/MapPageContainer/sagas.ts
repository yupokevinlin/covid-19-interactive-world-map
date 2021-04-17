import {call, put, select, takeEvery, all} from "redux-saga/effects";
import {MapPageActionTypes} from "./types";
import {MapPageHandleRegionChangeAction, MapPageInitAction} from "./actions";
import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {MapApi} from "../../../api/MapApi/MapApi";
import {CasesData} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {DateUtils} from "../../../helper/DateUtils";
import {ESRIMapPolygon} from "../../../display/components/ESRIMap/types";
import {getSequentialHierarchicalNames} from "../../../../../shared/helpers/General";

export const mapPageSagas = {
  initSaga: takeEvery(MapPageActionTypes.INIT, initSaga),
  handleRegionChange: takeEvery(MapPageActionTypes.HANDLE_REGION_CHANGE, handleRegionChange),
};

function * initSaga(action: MapPageInitAction): any {
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: [],
  });
  const esriMapPolygons: Array<ESRIMapPolygon> = yield call(getEsriMapPolygonsByHierarchicalName, "World");
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: esriMapPolygons,
  });

  const dateValues: Array<string> = DateUtils.getDateStringArray("1/1/20", DateUtils.getCurrentDate());
  yield put({
    type: MapPageActionTypes.SET_DATE_VALUES,
    dateValues: dateValues,
  });
}

function * handleRegionChange(action: MapPageHandleRegionChangeAction): any {
  const esriMapPolygons: Array<ESRIMapPolygon> = yield call(getEsriMapPolygonsByHierarchicalName, action.hierarchicalName);
  yield put({
    type: MapPageActionTypes.SET_MAP_POLYGONS,
    mapPolygons: esriMapPolygons,
  });
}

const getEsriMapPolygonsByHierarchicalName = (hierarchicalName: string): Promise<Array<ESRIMapPolygon>> => {
  return new Promise<Array<ESRIMapPolygon>>((resolve, reject) => {
    MapApi.getMapLayer0Data().then((mapPolygons) => {
      getMapPolygonsByHierarchicalName(mapPolygons, hierarchicalName).then((filteredMapPolygons) => {
        const hierarchicalNames: Array<string> = filteredMapPolygons.map((mapPolygon) => mapPolygon.hierarchicalName);
        getCasesData(hierarchicalNames).then((casesData) => {
          const esriMapPolygons: Array<ESRIMapPolygon> = getESRIMapPolygons(filteredMapPolygons, casesData);
          resolve(esriMapPolygons);
        });
      });
    });
  });
};

const getMapPolygonsByHierarchicalName = (mapPolygons: Array<MapPolygon>, hierarchicalName: string): Promise<Array<MapPolygon>> => {
  return new Promise<Array<MapPolygon>>((resolve, reject) => {
    if (hierarchicalName === "World") {
      resolve(mapPolygons);
    } else {
      let filteredMapPolygons: Array<MapPolygon> = mapPolygons;
      const sequentialHierarchicalNames: Array<string> = getSequentialHierarchicalNames(hierarchicalName);
      if (sequentialHierarchicalNames.length === 2) {
        filteredMapPolygons = filteredMapPolygons.filter((mapPolygon) => mapPolygon.hierarchicalName !== sequentialHierarchicalNames[1]);
        MapApi.getMapLayer1Data(sequentialHierarchicalNames[1]).then((layer1MapPolygons) => {
          filteredMapPolygons.push(...layer1MapPolygons);
          resolve(filteredMapPolygons);
        });
      } else if (sequentialHierarchicalNames.length === 3) {
        filteredMapPolygons = filteredMapPolygons.filter((mapPolygon) => mapPolygon.hierarchicalName !== sequentialHierarchicalNames[1]);
        MapApi.getMapLayer1Data(sequentialHierarchicalNames[1]).then((layer1MapPolygons) => {
          filteredMapPolygons.push(...layer1MapPolygons);
          filteredMapPolygons = filteredMapPolygons.filter((mapPolygon) => mapPolygon.hierarchicalName !== sequentialHierarchicalNames[2]);
          MapApi.getMapLayer2Data(sequentialHierarchicalNames[2]).then((layer2MapPolygons) => {
            filteredMapPolygons.push(...layer2MapPolygons);
            resolve(filteredMapPolygons);
          });
        });
      }
    }
  });
};

const getCasesData = (hierarchicalNames: Array<string>): Promise<Array<CasesData>> => {
  return new Promise<Array<CasesData>>(((resolve, reject) => {
    const getCasesDataArrayPromises: Array<Promise<CasesData>> = hierarchicalNames.map((hierarchicalName) => CasesApi.getCasesData(hierarchicalName));
    Promise.all(getCasesDataArrayPromises).then((values) => {
      resolve(values);
    });
  }));
};

const getESRIMapPolygons = (mapPolygons: Array<MapPolygon>, casesData: Array<CasesData>): Array<ESRIMapPolygon> => {
  return mapPolygons.map((mapPolygon, index) => {
    const caseData: CasesData = casesData[index];
    return {
      ...mapPolygon,
      ...caseData,
    }
  });
};

export default mapPageSagas;