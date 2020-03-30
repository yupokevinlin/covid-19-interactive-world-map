import { call, put, select, takeEvery } from "redux-saga/effects";
import moment, {Moment} from "moment";
import { MapPageContainerActionTypes, MapPageContainerState } from "./types";
import { MapPageContainerHandleRegionChangeAction, MapPageContainerInitializeAction } from "./action";
import { MapPolygon } from "../../../display/components/ESRIMap/ESRIMap";
import { MapApi } from "../../../api/MapApi/MapApi";
import { BreadCrumbItem } from "../../../display/components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import { Store } from "../../store";
import {ServerMapPolygon} from "../../../../../shared/types/data/Map/MapTypes";
import {CasesApi} from "../../../api/CasesApi/CasesApi";
import {
  ServerDailyCasesData, ServerDailyCasesDataObject,
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
  const resetMapPolygons = (): void => {
    newMapPolygonData = newMapPolygonData.map((mapPolygon, index) => {
      const level: number = mapPolygon.name.length;
      if (level === 1) {
        if (mapPolygon.hidden) {
          return {
            ...mapPolygon,
            hidden: false,
            internalId: maxInternalId + index
          }
        } else {
          return {
            ...mapPolygon
          }
        }
      } else {
        if (mapPolygon.hidden) {
          return {
            ...mapPolygon
          }
        } else {
          return {
            ...mapPolygon,
            hidden: true,
            internalId: maxInternalId + index
          }
        }
      }
    });
  };
  const previousState: MapPageContainerState = yield select(getMapPageContainerStateSelector);
  const newName: Array<string> = [...action.event.name];
  newName.shift();
  let newDisplayedConfirmedCasesCount: number = 0;
  let newDisplayedDeathsCount: number = 0;
  let newDisplayedRecoveredCasesCount: number = 0;
  let newRegionSelectData: BreadCrumbItem = previousState.regionSelectData;
  let newMapPolygonData: Array<MapPolygon> = previousState.mapPolygonData;

  const isWorld: boolean = newName.length === 0;
  const maxInternalId: number = Math.max(...previousState.mapPolygonData.map(data => data.internalId)) + 1;

  if (isWorld) {
    const worldDataAtDate: ServerDailyCasesData = previousState.worldCasesData.data[previousState.currentDateString];
    newDisplayedConfirmedCasesCount = worldDataAtDate.confirmedCases;
    newDisplayedDeathsCount = worldDataAtDate.deaths;
    newDisplayedRecoveredCasesCount = worldDataAtDate.recoveredCases;
    resetMapPolygons();
  } else {
    const casesData: ServerTimeSeriesCasesData = previousState.casesData[JSON.stringify(newName)];
    const layer: number = newName.length;
    const serverMapPolygonsData: Array<ServerMapPolygon> = yield call(MapApi.getMapLayer1Data, newName); //TODO map polygons should be loaded differently for level 2.

    //Map processing
    if (action.event.hasChildren) {
      let modifiedCount: number = 1;
      newMapPolygonData = newMapPolygonData.map((mapPolygon, index) => {
        const level: number = mapPolygon.name.length;
        if (mapPolygon.name[0] === newName[0]) {
          if (level <= layer) {
            modifiedCount++;
            return {
              ...mapPolygon,
              hidden: true,
              internalId: maxInternalId + index
            }
          } else {
            if (mapPolygon.hidden) {
              modifiedCount++;
              return {
                ...mapPolygon,
                hidden: false,
                internalId: maxInternalId + index
              }
            } else {
              return {
                ...mapPolygon
              }
            }
          }
        } else {
          if (level === 1) {
            if (mapPolygon.hidden) {
              modifiedCount++;
              return {
                ...mapPolygon,
                hidden: false,
                internalId: maxInternalId + index
              }
            } else {
              return {
                ...mapPolygon
              }
            }
          } else {
            if (mapPolygon.hidden) {
              return {
                ...mapPolygon
              }
            } else {
              modifiedCount++;
              return {
                ...mapPolygon,
                hidden: true,
                internalId: maxInternalId + index
              }
            }
          }
        }
      });

      const serverMapPolygonsToAdd: Array<ServerMapPolygon> = serverMapPolygonsData.filter(serveMapPolygonData => {
        let exists: boolean = false;
        for (let index = 0; index < newMapPolygonData.length; index++) {
          if (JSON.stringify(newMapPolygonData[index].name) === JSON.stringify(serveMapPolygonData.name)) {
            exists = true;
            break;
          }
        }
        return !exists;
      });

      const mapPolygonsToAdd: Array<MapPolygon> = serverMapPolygonsToAdd.map((serverMapPolygon, index) => {
        const matchingCasesData: ServerDailyCasesDataObject = previousState.casesData[JSON.stringify(serverMapPolygon.name)]?.data;
        return {
          internalId: maxInternalId + modifiedCount + index,
          name: serverMapPolygon.name,
          hasChildren: serverMapPolygon.hasChildren && previousState.casesData[JSON.stringify(serverMapPolygon.name)]?.hasChildren || false,
          type: serverMapPolygon.type,
          countryCode: serverMapPolygon.countryCode,
          displayedConfirmedCasesCount: matchingCasesData ? matchingCasesData[previousState.currentDateString].confirmedCases || 0 : 0,
          displayedDeathsCount: matchingCasesData ? matchingCasesData[previousState.currentDateString].deaths || 0 : 0,
          displayedRecoveredCasesCount: matchingCasesData ? matchingCasesData[previousState.currentDateString].recoveredCases || 0 : 0,
          data: matchingCasesData,
          geometry: serverMapPolygon.geometry,
          hidden: false
        }
      });
      newMapPolygonData = [...newMapPolygonData, ...mapPolygonsToAdd];
    } else {
      resetMapPolygons();
    }

    //Breadcrumbs processing
    if (casesData) {
      const casesDataAtDate: ServerDailyCasesData = casesData.data[previousState.currentDateString];
      newDisplayedConfirmedCasesCount = casesDataAtDate.confirmedCases;
      newDisplayedDeathsCount = casesDataAtDate.deaths;
      newDisplayedRecoveredCasesCount = casesDataAtDate.recoveredCases;
      let regionSelectData: BreadCrumbItem = newRegionSelectData;
      newName.forEach((name, index) => {
        const nameArray: Array<string> = ["World"];
        for (let i = 0; i <= index; i++) {
          nameArray.push(name);
        }
        const matchingRegionSelectData: BreadCrumbItem = regionSelectData.childElements.find(childElement => JSON.stringify(childElement.name) === JSON.stringify(nameArray));
        if (matchingRegionSelectData) {
          if (matchingRegionSelectData.hasChildren && matchingRegionSelectData.childElements.length === 0) {
            matchingRegionSelectData.childElements = serverMapPolygonsData.map(mapPolygonData => {
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
      mapPolygonData: newMapPolygonData
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
