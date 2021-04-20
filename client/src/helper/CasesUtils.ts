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
  import getDateStringFromMomentDate = DateUtils.getDateStringFromMomentDate;
  import getMomentDateFromDateString = DateUtils.getMomentDateFromDateString;
  export const getDailyCasesData = (dailyCasesDataObject: DailyCasesDataObject, dateString: string): DailyCasesData | DailyCasesDataNull => {
    const data: DailyCasesData | undefined = dailyCasesDataObject[dateString];
    if (!!data) {
      return data;
    } else {
      const date: Moment = getMomentDateFromDateString(dateString);
      for (let i = 0; i < 10; i++) {
        date.subtract(1, "days");
        const previousDayData: DailyCasesData | undefined = dailyCasesDataObject[getDateStringFromMomentDate(date)];
        if (!!previousDayData) {
          return previousDayData;
        } else {
          if (i === 9) {
            console.error(`Unable to get cases data on day: ${dateString}.`);
            console.error("Daily Cases Object");
            console.log(dailyCasesDataObject);
            return {
              totalCases: null,
              totalRecoveries: null,
              totalDeaths: null,
            }
          }
        }
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
      const date: Moment = getMomentDateFromDateString(dateString);
      for (let i = 0; i < 10; i++) {
        date.subtract(1, "days");
        const previousDayData: DailyCasesInformationData | undefined = dailyCasesInformationDataObject[getDateStringFromMomentDate(date)];
        if (!!previousDayData) {
          return previousDayData;
        } else {
          if (i === 9) {
            console.error(`Unable to get cases data on day: ${dateString}.`);
            console.error("Daily Cases Object");
            console.log(dailyCasesInformationDataObject);
            return {
              cases: null,
              recoveries: null,
              deaths: null,
            }
          }
        }
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