import mapLayer0 from "../../../../data/map/gadm/gadm36_0_processed_array.json";
import {ServerMapPolygon} from "../../../../shared/types/data/Map/MapTypes";

export namespace MapApi {
  export const getMapLayer0Data = (): Array<ServerMapPolygon> => {
    return mapLayer0 as Array<ServerMapPolygon>;
  };
}
