import {CasesData, CasesDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  export const getCasesDataByHierarchicalName = (hierarchicalName: string): CasesData | undefined => {
    return CasesUtils.data[hierarchicalName];
  };

  export const getCasesDataByHierarchicalNames = (hierarchicalNames: Array<string>): Array<CasesData | undefined> => {
    return hierarchicalNames.map((hierarchicalName) => getCasesDataByHierarchicalName(hierarchicalName));
  };

  export const getAllCasesData = (): CasesDataObject => {
    return CasesUtils.data;
  };
}