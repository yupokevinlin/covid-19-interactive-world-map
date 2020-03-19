import { call, put, select, takeEvery } from "redux-saga/effects";
import { GetMapPolygonReturnData, MapPageContainerActionTypes, MapPageContainerState } from "./types";
import { MapPageContainerHandleRegionChangeAction, MapPageContainerInitializeAction } from "./action";
import { MapPolygon } from "../../../display/components/ESRIMap/ESRIMap";
import { CountryOutline } from "../../../api/MapApi/types";
import { MapApi } from "../../../api/MapApi/MapApi";
import { BreadCrumbItem } from "../../../display/components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import { Store } from "../../store";

export const mapPageContainerSagas = {
  initialize: takeEvery(MapPageContainerActionTypes.INITIALIZE, initialize),
  handleRegionChange: takeEvery(MapPageContainerActionTypes.HANDLE_REGION_CHANGE, handleRegionChange),
};

function* initialize(action: MapPageContainerInitializeAction): any {
  const initialState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  const countryOutlines: Array<CountryOutline> = MapApi.getCountryOutlines();
  const mapPolygonReturnData: GetMapPolygonReturnData = getMapPolygonData(countryOutlines, initialState.language);
  const regionSelectData: BreadCrumbItem = getRegionSelectData(countryOutlines, initialState.language);
  yield put({
    type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
    state: {
      ...initialState,
      mapPolygonData: mapPolygonReturnData.mapPolygon,
      worldConfirmedCasesCount: mapPolygonReturnData.worldConfirmedCasesCount,
      worldRecoveredCasesCount: mapPolygonReturnData.worldRecoveredCasesCount,
      worldDeathsCount: mapPolygonReturnData.worldDeathsCount,
      confirmedCasesCount: mapPolygonReturnData.worldConfirmedCasesCount,
      recoveredCasesCount: mapPolygonReturnData.worldRecoveredCasesCount,
      deathsCount: mapPolygonReturnData.worldDeathsCount,
      regionSelectData: regionSelectData,
      isLoaded: true,
    },
  });
}

function* handleRegionChange(action: MapPageContainerHandleRegionChangeAction): any {
  const previousState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  const matchingData: MapPolygon = previousState.mapPolygonData.find(
    polygon => JSON.stringify(polygon.name) === JSON.stringify(action.event.name)
  );
  yield put({
    type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
    state: {
      ...previousState,
      currentCountryName: action.event.name[action.event.name.length - 1],
      currentCountryCode: action.event.countryCode ? action.event.countryCode : previousState.currentCountryCode,
      confirmedCasesCount:
        action.event.countryCode === "World"
          ? previousState.worldConfirmedCasesCount
          : matchingData.confirmedCasesCount,
      recoveredCasesCount:
        action.event.countryCode === "World"
          ? previousState.worldRecoveredCasesCount
          : matchingData.recoveredCasesCount,
      deathsCount: action.event.countryCode === "World" ? previousState.worldDeathsCount : matchingData.deathsCount,
    },
  });
}

const getMapPolygonData = (countryOutlines: Array<CountryOutline>, language: string): GetMapPolygonReturnData => {
  const testNumbers: Array<number> = [
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    10,
    10,
    10,
    100,
    100,
    100,
    1000,
    1000,
    10000,
    100000,
    1000000,
  ];
  let worldConfirmedCasesCount: number = 0;
  let worldDeathsCount: number = 0;
  let worldRecoveredCasesCount: number = 0;
  return {
    mapPolygon: countryOutlines.map((countryOutline, index) => {
      const confirmedCasesCount: number = Math.floor(testNumbers[Math.floor(Math.random() * testNumbers.length)] * 0.1);
      const recoveredCasesCount: number = Math.floor(
        testNumbers[Math.floor(Math.random() * testNumbers.length)] * 0.04
      );
      const deathsCount: number = Math.floor(testNumbers[Math.floor(Math.random() * testNumbers.length)] * 0.01);
      worldConfirmedCasesCount = worldConfirmedCasesCount + confirmedCasesCount;
      worldDeathsCount = worldDeathsCount + deathsCount;
      worldRecoveredCasesCount = worldRecoveredCasesCount + recoveredCasesCount;
      return {
        internalId: index,
        name: ["World", countryOutline.name[language]],
        confirmedCasesCount: confirmedCasesCount,
        recoveredCasesCount: recoveredCasesCount,
        deathsCount: deathsCount,
        geometry: countryOutline.geometry,
        countryCode: countryOutline.countryCode,
      };
    }),
    worldConfirmedCasesCount: worldConfirmedCasesCount,
    worldRecoveredCasesCount: worldRecoveredCasesCount,
    worldDeathsCount: worldDeathsCount,
  };
};

const getRegionSelectData = (countryOutlines: Array<CountryOutline>, language: string): BreadCrumbItem => {
  return {
    name: ["World"],
    countryCode: "World",
    childElements: countryOutlines.map(countryOutline => ({
      name: ["World", countryOutline.name[language]],
      countryCode: countryOutline.countryCode,
      childElements: [],
    })),
  };
};

const getMapPageContainerStateSelector = (store: Store): MapPageContainerState => {
  return store.map;
};

export default mapPageContainerSagas;
