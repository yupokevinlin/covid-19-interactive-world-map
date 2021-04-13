import {MapPolygon, MapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
const mapLayer0: Array<MapPolygon> = require("../../../../data/map/gadm/gadm36_0_processed_array.json");
const mapLayer1: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_1_processed_object.json");
const mapLayer2: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_2_processed_object.json");

export namespace MapService {
  export const getMayLayer0Polygons = (): Array<MapPolygon> => {
    return mapLayer0;
  };
  export const getMayLayer1Polygons = (hierarchicalName: string): Array<MapPolygon> => {
    return mapLayer1[hierarchicalName] || [];
  };
  export const getMayLayer2Polygons = (hierarchicalName: string): Array<MapPolygon> => {
    return mapLayer2[hierarchicalName] || [];
  };
}