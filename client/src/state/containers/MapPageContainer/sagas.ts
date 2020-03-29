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
  ServerDailyCasesData,
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
      mapPolygonData: getInitialMapPolygonData(layer0MapData, casesData, currentDateString),
      regionSelectData: getInitialRegionSelectData(layer0MapData, layer0CasesData),
      isLoaded: true
    }
  });
}

function* handleRegionChange(action: MapPageContainerHandleRegionChangeAction): any {
  const previousState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  const newName: Array<string> = [...action.event.name];
  newName.shift();
  // const matchingMapPolygon: MapPolygon = previousState.mapPolygonData.find(
  //   polygon => JSON.stringify(polygon.name) === JSON.stringify(newName)
  // );

  // const displayedConfirmedCasesCount: number =
  // console.log(casesData);
  let newDisplayedConfirmedCasesCount: number = 0;
  let newDisplayedDeathsCount: number = 0;
  let newDisplayedRecoveredCasesCount: number = 0;
  let newRegionSelectData: BreadCrumbItem = previousState.regionSelectData;


  const isWorld: boolean = newName.length === 0;
  if (isWorld) {
    const worldDataAtDate: ServerDailyCasesData = previousState.worldCasesData.data[previousState.currentDateString];
    newDisplayedConfirmedCasesCount = worldDataAtDate.confirmedCases;
    newDisplayedDeathsCount = worldDataAtDate.deaths;
    newDisplayedRecoveredCasesCount = worldDataAtDate.recoveredCases
  } else {
    const layer: number = newName.length;
    const casesData: ServerTimeSeriesCasesData = previousState.casesData[JSON.stringify(newName)];
    const mapPolygonsData: Array<ServerMapPolygon> = yield call(MapApi.getMapLayer1Data, newName);
    if (casesData) {
      const casesDataAtDate: ServerDailyCasesData = casesData.data[previousState.currentDateString];
      newDisplayedConfirmedCasesCount = casesDataAtDate.confirmedCases;
      newDisplayedDeathsCount = casesDataAtDate.deaths;
      newDisplayedRecoveredCasesCount = casesDataAtDate.recoveredCases;
      const modifiedRegionSelectData: BreadCrumbItem = {
        ...newRegionSelectData,
        childElements: []
      };
      let regionSelectData: BreadCrumbItem = newRegionSelectData;
      newName.forEach((name, index) => {

        const nameArray: Array<string> = ["World"];
        for (let i = 0; i <= index; i++) {
          nameArray.push(name);
        }
        const matchingRegionSelectData: BreadCrumbItem = regionSelectData.childElements.find(childElement => JSON.stringify(childElement.name) === JSON.stringify(nameArray));
        if (matchingRegionSelectData) {
          if (matchingRegionSelectData.hasChildren && matchingRegionSelectData.childElements.length === 0) {
            matchingRegionSelectData.childElements = mapPolygonsData.map(mapPolygonData => {
              return {
                name: ["World", ...mapPolygonData.name],
                countryCode: matchingRegionSelectData.countryCode,
                hasChildren: mapPolygonData.hasChildren && previousState?.casesData[JSON.stringify(mapPolygonData.name)]?.hasChildren || false,
                childElements: []
              }
            })
          }
          regionSelectData = matchingRegionSelectData;
        }
      });
    }
  }
  
  yield put({
    type: MapPageContainerActionTypes.SET_MAP_PAGE_CONTAINER_STATE,
    state: {
      ...previousState,
      displayedConfirmedCasesCount: newDisplayedConfirmedCasesCount,
      displayedDeathsCount: newDisplayedDeathsCount,
      displayedRecoveredCasesCount: newDisplayedRecoveredCasesCount,
      currentName: newName,
      regionSelectData: newRegionSelectData,
    },
  });
}

const getInitialMapPolygonData = (layer0MapData: Array<ServerMapPolygon>, casesData: ServerTimeSeriesCasesDataObject, currentDateString: string): Array<MapPolygon> => {
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
      hasChildren: layerData.hasChildren && matchingCasesData?.hasChildren || false,
      hidden: false
    };
    return mapPolygon;
  });
};

const getInitialRegionSelectData = (layer0MapData: Array<ServerMapPolygon>, layer0CasesData: ServerTimeSeriesCasesDataObject): BreadCrumbItem => {
  return {
    name: ["World"],
    countryCode: "World",
    hasChildren: true,
    childElements: layer0MapData.map(layer0 => {
      const matchingLayer0CasesData: ServerTimeSeriesCasesData = layer0CasesData[JSON.stringify(layer0.name)];
      let layer0CasesHasChildren: boolean = false;
      if (matchingLayer0CasesData) {
        layer0CasesHasChildren = matchingLayer0CasesData.hasChildren;
      }
      return {
        name: ["World", layer0.name[0]],
        countryCode: layer0.countryCode,
        hasChildren: layer0.hasChildren && layer0CasesHasChildren,
        childElements: []
      }
    }),
  };
};

const getMapPageContainerStateSelector = (store: Store): MapPageContainerState => {
  return store.map;
};

export default mapPageContainerSagas;
