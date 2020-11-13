import {ServerMapPolygon, ServerMapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
const mapLayer0: Array<ServerMapPolygon> = require("../../../../data/map/gadm/gadm36_0_processed_array.json");
const mapLayer1: ServerMapPolygonsObject = require("../../../../data/map/gadm/gadm36_1_processed_object.json");
const mapLayer2: ServerMapPolygonsObject = require("../../../../data/map/gadm/gadm36_2_processed_object.json");

export namespace MapService {
  export const getMayLayer0Polygons = (): Array<ServerMapPolygon> => {
    return mapLayer0;
  };
  export const getMayLayer1Polygons = (hierarchicalName: string): Array<ServerMapPolygon> => {
    return mapLayer1[hierarchicalName] || [];
  };
  export const getMayLayer2Polygons = (hierarchicalName: string): Array<ServerMapPolygon> => {
    return mapLayer2[hierarchicalName] || [];
  };
}