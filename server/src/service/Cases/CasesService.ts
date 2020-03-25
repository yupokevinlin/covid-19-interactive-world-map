import {
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  export const getWorldCases = (): ServerTimeSeriesCasesData => {
    return CasesUtils.worldData;
  };
  export const getLayer0Cases = (): ServerTimeSeriesCasesDataObject => {
    return CasesUtils.layer0CasesTimeSeries;
  };
  export const getLayer0CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer0CasesTimeSeries[name];
  };
  export const getLayer1Cases = (): ServerTimeSeriesCasesDataObject => {
    return CasesUtils.layer1CasesTimeSeries;
  };
  export const getLayer1CasesByLayer0Name = (name: string): ServerTimeSeriesCasesDataObject => {
    const returnObject: ServerTimeSeriesCasesDataObject = {};
    Object.entries(CasesUtils.layer1CasesTimeSeries).forEach(([key, value]) => {
      if (JSON.stringify([value.name[0]]) === name) {
        returnObject[JSON.stringify(value.name)] = value;
      }
    });
    return returnObject;
  };
  export const getLayer1CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer1CasesTimeSeries[name];
  };
  export const getLayer2Cases = (): ServerTimeSeriesCasesDataObject => {
    return CasesUtils.layer2CasesTimeSeries;
  };
  export const getLayer2CasesByLayer0Layer1Names = (name: string): ServerTimeSeriesCasesDataObject => {
    const returnObject: ServerTimeSeriesCasesDataObject = {};
    Object.entries(CasesUtils.layer2CasesTimeSeries).forEach(([key, value]) => {
      if (JSON.stringify([value.name[0], value.name[1]]) === name) {
        returnObject[JSON.stringify(value.name)] = value;
      }
    });
    return returnObject;
  };
  export const getLayer2CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer2CasesTimeSeries[name];
  };
}