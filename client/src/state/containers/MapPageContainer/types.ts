import {ESRIMapModeNames, ESRIMapPolygon} from "../../../display/components/ESRIMap/ESRIMap";

export interface MapPageState {
  mapPolygons: Array<ESRIMapPolygon>;
  displayedLayer: ESRIMapModeNames;
  date: string;
  hierarchicalName: string;
  initialBaseMap: string;
}

export enum MapPageActionTypes {
  INIT = "map.INIT",
  SET_MAP_POLYGONS = "map.SET_MAP_POLYGONS",
  SET_DISPLAYED_LAYER = "map.SET_DISPLAYED_LAYER",
  SET_DATE = "map.SET_DATE",
  SET_HIERARCHICAL_NAME = "map.SET_HIERARCHICAL_NAME",
}