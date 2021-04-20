import {CasesData, CasesDataObject, CasesInformationDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
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

  export const getAllDailyCasesInformationData = (): CasesInformationDataObject => {
    return CasesUtils.dailyInfoData;
  };

  export const getAllWeeklyCasesInformationData = (): CasesInformationDataObject => {
    return CasesUtils.weeklyInfoData;
  };

  export const getAllMonthlyCasesInformationData = (): CasesInformationDataObject => {
    return CasesUtils.monthlyInfoData;
  };

  export const getAllYearlyCasesInformationData = (): CasesInformationDataObject => {
    return CasesUtils.yearlyInfoData;
  };
}