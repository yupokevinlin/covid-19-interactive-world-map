import {ServerCasesData} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "./CasesUtils";

export namespace CasesService {
  export const getCasesDataByHierarchicalName = (hierarchicalName: string): ServerCasesData | undefined => {
    return CasesUtils.data[hierarchicalName];
  };
}