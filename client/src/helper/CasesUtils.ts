import {
  CasesInformationDataObject,
  DailyCasesData,
  DailyCasesDataNull,
  DailyCasesDataObject, DailyCasesInformationData, DailyCasesInformationDataNull,
  DailyCasesInformationDataObject
} from "../../../shared/types/data/Cases/CasesTypes";
import {Moment} from "moment";
import {DateUtils} from "./DateUtils";
import {CasesDataTypes} from "../state/global/App/types";

export namespace CasesUtils {
  export const getDailyCasesData = (dailyCasesDataObject: DailyCasesDataObject, dateString: string): DailyCasesData | DailyCasesDataNull => {
    const data: DailyCasesData | undefined = dailyCasesDataObject[dateString];
    if (!!data) {
      return data;
    } else {
      return {
        totalCases: null,
        totalRecoveries: null,
        totalDeaths: null,
      }
    }
  };
  export const getDailyCasesInformationData = (dailyCasesInformationDataObject: DailyCasesInformationDataObject, dateString: string): DailyCasesInformationData | DailyCasesInformationDataNull => {
    if (!dailyCasesInformationDataObject) {
      return {
        cases: null,
        recoveries: null,
        deaths: null,
      }
    }
    const data: DailyCasesInformationData | undefined = dailyCasesInformationDataObject[dateString];
    if (!!data) {
      return data;
    } else {
      return {
        cases: null,
        recoveries: null,
        deaths: null,
      }
    }
  };

  export const getCasesInformationDataObject = (casesDataType: CasesDataTypes, dailyCasesInformationDataObject: CasesInformationDataObject, weeklyCasesInformationDataObject: CasesInformationDataObject, monthlyCasesInformationDataObject: CasesInformationDataObject, yearlyCasesInformationDataObject: CasesInformationDataObject): CasesInformationDataObject => {
    switch (casesDataType) {
      case CasesDataTypes.Daily: {
        return dailyCasesInformationDataObject;
      }
      case CasesDataTypes.Weekly: {
        return weeklyCasesInformationDataObject;
      }
      case CasesDataTypes.Monthly: {
        return monthlyCasesInformationDataObject;
      }
      case CasesDataTypes.Yearly: {
        return yearlyCasesInformationDataObject;
      }
      default: {
        return null;
      }
    }
  };
}