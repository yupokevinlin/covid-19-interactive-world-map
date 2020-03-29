import mapLayer0 from "../../../../data/map/gadm/gadm36_0_processed_array.json";
import {ServerMapPolygon} from "../../../../shared/types/data/Map/MapTypes";
import {Api} from "../Api";
import axios from "axios";

export namespace MapApi {
  export const getMapLayer0Data = (): Array<ServerMapPolygon> => {
    return mapLayer0 as Array<ServerMapPolygon>;
  };
  export const getMapLayer1Data = async (name: Array<string>): Promise<Array<ServerMapPolygon>> => {
    const url: string = `${Api.serverLocation}api/map/layer1/${JSON.stringify(name)}`;
    const rsp: any = await axios({
      method: "GET",
      url: url
    });
    return rsp.data;
  };
}
