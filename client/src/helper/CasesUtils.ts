import {DailyCasesData, DailyCasesDataNull, DailyCasesDataObject} from "../../../shared/types/data/Cases/CasesTypes";
import {Moment} from "moment";
import {DateUtils} from "./DateUtils";

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
}