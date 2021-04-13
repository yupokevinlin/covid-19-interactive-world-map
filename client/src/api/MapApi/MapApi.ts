import {MapPolygon} from "../../../../shared/types/data/Map/MapTypes";
import {Api} from "../Api";
import axios from "axios";

export namespace MapApi {
  export const getMapLayer0Data = (): Promise<Array<MapPolygon>> => {
    const url: string = `${Api.serverLocation}/api/map/layer0`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getMapLayer1Data = (hierarchicalName: string): Promise<Array<MapPolygon>> => {
    const url: string = `${Api.serverLocation}/api/map/layer1/${hierarchicalName}`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getMapLayer2Data = (hierarchicalName: string): Promise<Array<MapPolygon>> => {
    const url: string = `${Api.serverLocation}/api/map/layer2/${hierarchicalName}`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
}
