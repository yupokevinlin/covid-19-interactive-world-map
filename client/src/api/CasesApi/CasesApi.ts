import {Api} from "../Api";
import axios from "axios";
import {CasesData, CasesDataObject} from "../../../../shared/types/data/Cases/CasesTypes";

export namespace CasesApi {
  export const getCasesData = (hierarchicalName: string): Promise<CasesData> => {
    const url: string = `${Api.serverLocation}/api/cases/single/${hierarchicalName}`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getAllCasesData = (): Promise<CasesDataObject> => {
    const url: string = `${Api.serverLocation}/api/cases/all`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
}