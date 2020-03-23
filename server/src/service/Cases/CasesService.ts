import {
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  import layer0CasesTimeSeries = CasesUtils.layer0CasesTimeSeries;
  import layer1CasesTimeSeries = CasesUtils.layer1CasesTimeSeries;
  import layer2CasesTimeSeries = CasesUtils.layer2CasesTimeSeries;
  import worldData = CasesUtils.worldData;
  export const getWorldCases = (): ServerTimeSeriesCasesData => {
    return worldData;
  };
  export const getLayer0Cases = (): ServerTimeSeriesCasesDataObject => {
    return layer0CasesTimeSeries;
  };
  export const getLayer0CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return layer0CasesTimeSeries[name];
  };
  export const getLayer1CasesByLayer0Name = (name: string): ServerTimeSeriesCasesDataObject => {
    const returnObject: ServerTimeSeriesCasesDataObject = {};
    Object.entries(layer1CasesTimeSeries).forEach(([key, value]) => {
      if (JSON.stringify([value.name[0]]) === name) {
        returnObject[JSON.stringify(value.name)] = value;
      }
    });
    return returnObject;
  };
  export const getLayer1CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return layer1CasesTimeSeries[name];
  };
  export const getLayer2CasesByLayer0Layer1Names = (name: string): ServerTimeSeriesCasesDataObject => {
    const returnObject: ServerTimeSeriesCasesDataObject = {};
    Object.entries(layer2CasesTimeSeries).forEach(([key, value]) => {
      if (JSON.stringify([value.name[0], value.name[1]]) === name) {
        returnObject[JSON.stringify(value.name)] = value;
      }
    });
    return returnObject;
  };
  export const getLayer2CasesByName = (name: string): ServerTimeSeriesCasesData => {
    return layer2CasesTimeSeries[name];
  };
}