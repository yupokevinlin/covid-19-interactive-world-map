import {ServerTimeSeriesCasesData} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  export const getWorldCases = (): ServerTimeSeriesCasesData => {
    return CasesUtils.worldData;
  };
  export const getLayer0Cases = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer0CasesTimeSeries[name];
  };
  export const getLayer1Cases = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer1CasesTimeSeries[name];
  };
  export const getLayer2Cases = (name: string): ServerTimeSeriesCasesData => {
    return CasesUtils.layer2CasesTimeSeries[name];
  };
}