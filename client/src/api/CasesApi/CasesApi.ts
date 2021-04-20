import {Api} from "../Api";
import axios from "axios";
import {CasesData, CasesDataObject, CasesInformationDataObject} from "../../../../shared/types/data/Cases/CasesTypes";

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
  export const getMultipleCasesData = (hierarchicalNames: Array<string>): Promise<Array<CasesData>> => {
    const url: string = `${Api.serverLocation}/api/cases/multiple`;
    return axios({
      method: "POST",
      url: url,
      data: {
        hierarchicalNames: JSON.stringify(hierarchicalNames),
      },
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
  export const getAllDailyCasesInformationData = (): Promise<CasesInformationDataObject> => {
    const url: string = `${Api.serverLocation}/api/cases/daily/all`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getAllWeeklyCasesInformationData = (): Promise<CasesInformationDataObject> => {
    const url: string = `${Api.serverLocation}/api/cases/weekly/all`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getAllMonthlyCasesInformationData = (): Promise<CasesInformationDataObject> => {
    const url: string = `${Api.serverLocation}/api/cases/monthly/all`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
  export const getAllYearlyCasesInformationData = (): Promise<CasesInformationDataObject> => {
    const url: string = `${Api.serverLocation}/api/cases/yearly/all`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
}