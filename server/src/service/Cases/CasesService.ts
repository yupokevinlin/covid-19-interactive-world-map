import {CasesData, CasesDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  export const getCasesDataByHierarchicalName = (hierarchicalName: string): CasesData | undefined => {
    return CasesUtils.data[hierarchicalName];
  };

  export const getAllCasesData = (): CasesDataObject => {
    return CasesUtils.data;
  };
}