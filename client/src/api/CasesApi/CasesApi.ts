import {
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../shared/types/data/Cases/CasesTypes";
import {Api} from "../Api";
import axios from "axios";

export namespace CasesApi {
  export const dateFormat: string = "M/D/YY";
  export const getWorldCases = async (): Promise<ServerTimeSeriesCasesData> => {
    const url: string = `${Api.serverLocation}api/cases/world`;
    const rsp: any = await axios({
      method: "GET",
      url: url
    });
    return rsp.data;
  };
  export const getLayer0Cases = async (): Promise<ServerTimeSeriesCasesDataObject> => {
    const url: string = `${Api.serverLocation}api/cases/layer0`;
    const rsp: any = await axios({
      method: "GET",
      url: url
    });
    return rsp.data;
  };
  export const getLayer1Cases = async (): Promise<ServerTimeSeriesCasesDataObject> => {
    const url: string = `${Api.serverLocation}api/cases/layer1`;
    const rsp: any = await axios({
      method: "GET",
      url: url
    });
    return rsp.data;
  };
  export const getLayer2Cases = async (): Promise<ServerTimeSeriesCasesDataObject> => {
    const url: string = `${Api.serverLocation}api/cases/layer1`;
    const rsp: any = await axios({
      method: "GET",
      url: url
    });
    return rsp.data;
  };
}