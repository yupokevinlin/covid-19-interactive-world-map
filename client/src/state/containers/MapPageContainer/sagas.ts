import { call, put, select, takeEvery } from "redux-saga/effects";
import moment, {Moment} from "moment";
import { GetMapPolygonReturnData, MapPageContainerActionTypes, MapPageContainerState } from "./types";
import { MapPageContainerHandleRegionChangeAction, MapPageContainerInitializeAction } from "./action";
import { MapPolygon } from "../../../display/components/ESRIMap/ESRIMap";
import { CountryOutline } from "../../../api/MapApi/types";
import { MapApi } from "../../../api/MapApi/MapApi";
import { BreadCrumbItem } from "../../../display/components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import { Store } from "../../store";
import {ServerMapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../../shared/types/data/Cases/CasesTypes";

export const mapPageContainerSagas = {
  initialize: takeEvery(MapPageContainerActionTypes.INITIALIZE, initialize),
  handleRegionChange: takeEvery(MapPageContainerActionTypes.HANDLE_REGION_CHANGE, handleRegionChange),
};

function* initialize(action: MapPageContainerInitializeAction): any {
  const initialState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  const layer0MapData: Array<ServerMapPolygon> = MapApi.getMapLayer0Data();
  const layer0CasesData: ServerTimeSeriesCasesDataObject = yield call(CasesApi.getLayer0Cases);
  const layer1CasesData: ServerTimeSeriesCasesDataObject = yield call(CasesApi.getLayer1Cases);
  const layer2CasesData: ServerTimeSeriesCasesDataObject = yield call(CasesApi.getLayer2Cases);
  const casesData: ServerTimeSeriesCasesDataObject = {
    ...layer0CasesData,
    ...layer1CasesData,
    ...layer2CasesData
  };

  const worldCases: ServerTimeSeriesCasesData = yield call(CasesApi.getWorldCases);
  const lastDayString: string = Object.keys(worldCases.data)[Object.keys(worldCases.data).length - 1];
  const lastDayArray: Array<string> = lastDayString.split("/");
  const currentDate: Moment = moment().date(parseInt(lastDayArray[1])).month(parseInt(lastDayArray[0]) - 1).year(parseInt(`20${lastDayArray[2]}`)).startOf("day");
  const currentDateString: string = currentDate.format(CasesApi.dateFormat);
  yield put({
    type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
    state: {
      ...initialState,
      worldCasesData: worldCases,
      casesData: casesData,
      displayedConfirmedCasesCount: worldCases.data[currentDateString].confirmedCases,
      displayedDeathsCount: worldCases.data[currentDateString].deaths,
      displayedRecoveredCasesCount: worldCases.data[currentDateString].recoveredCases,
      currentName: [],
      currentDateString: currentDateString,
      countryCode: "",
      mapPolygonData: getMapPolygonData(layer0MapData, casesData, currentDateString),
      isLoaded: true
    }
  });
}

function* handleRegionChange(action: MapPageContainerHandleRegionChangeAction): any {
  // const previousState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  // const matchingData: MapPolygon = previousState.mapPolygonData.find(
  //   polygon => JSON.stringify(polygon.name) === JSON.stringify(action.event.name)
  // );
  // yield put({
  //   type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
  //   state: {
  //     ...previousState,
  //     currentCountryName: action.event.name[action.event.name.length - 1],
  //     currentCountryCode: action.event.countryCode ? action.event.countryCode : previousState.currentCountryCode,
  //     confirmedCasesCount:
  //       action.event.countryCode === "World"
  //         ? previousState.worldConfirmedCasesCount
  //         : matchingData.confirmedCasesCount,
  //     recoveredCasesCount:
  //       action.event.countryCode === "World"
  //         ? previousState.worldRecoveredCasesCount
  //         : matchingData.recoveredCasesCount,
  //     deathsCount: action.event.countryCode === "World" ? previousState.worldDeathsCount : matchingData.deathsCount,
  //   },
  // });
}

const getMapPolygonData = (layer0MapData: Array<ServerMapPolygon>, casesData: ServerTimeSeriesCasesDataObject, currentDateString: string): Array<MapPolygon> => {
  return layer0MapData.map((layerData, index) => {
    const nameString: string = JSON.stringify(layerData.name);
    const matchingCasesData: ServerTimeSeriesCasesData = casesData[nameString];
    const mapPolygon: MapPolygon = {
      internalId: index,
      name: layerData.name,
      countryCode: layerData.countryCode,
      geometry: layerData.geometry,
      type: layerData.type,
      displayedConfirmedCasesCount: matchingCasesData?.data[currentDateString]?.confirmedCases || 0,
      displayedDeathsCount: matchingCasesData?.data[currentDateString]?.deaths || 0,
      displayedRecoveredCasesCount: matchingCasesData?.data[currentDateString]?.recoveredCases || 0,
      data: matchingCasesData?.data || {},
      hasChildren: layerData.hasChildren && matchingCasesData?.hasChildren || false
    };
    return mapPolygon;
  });
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
