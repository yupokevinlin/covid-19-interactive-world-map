import {
  CasesData,
  CasesDataObject,
  DailyCasesDataObject
} from "../../../shared/types/data/Cases/CasesTypes";
import {ChartPageLineChartDataProps} from "../display/components/ChartPageLineChart/ChartPageLineChart";
import {ChartPageLineChartData} from "../display/components/ChartPageLineChart/types";
import {CasesTypes} from "../state/global/App/types";
import {DateUtils} from "./DateUtils";

export namespace ChartUtils {
  import getDateFromDateString = DateUtils.getDateFromDateString;
  export const getChartPageLineChartDataPropsFromCasesDataObject = (casesDataObject: CasesDataObject, hierarchicalName: string, casesType: CasesTypes): ChartPageLineChartDataProps => {
    const matchingCasesData: CasesData | null = casesDataObject[hierarchicalName];
    const data: ChartPageLineChartDataProps = {
      maxValue: 0,
      minValue: 0,
      startDate: new Date(),
      endDate: new Date(),
      data: [],
    };
    if (!matchingCasesData) {
      return data;
    } else {
      const matchingDailyCasesData: DailyCasesDataObject = matchingCasesData.data;
      let maxValue: number = 0;
      let minValue: number = 0;
      let startDateString: string = "";
      let endDateString: string = "";
      const chartData: Array<ChartPageLineChartData> = Object.entries(matchingDailyCasesData).map(([dateString, dailyCasesData], index) => {
        let number: number = 0;
        switch (casesType) {
          case CasesTypes.CASES: {
            number = dailyCasesData.totalCases;
            break;
          }
          case CasesTypes.DEATHS: {
            number = dailyCasesData.totalDeaths;
            break;
          }
          case CasesTypes.RECOVERIES: {
            number = dailyCasesData.totalRecoveries;
            break;
          }
        }
        if (index === 0) {
          startDateString = dateString;
        } else if (index === Object.keys(matchingDailyCasesData).length - 1) {
          endDateString = dateString;
        }
        maxValue = Math.max(maxValue, number);
        minValue = Math.min(minValue, number);
        return {
          value: number,
          date: getDateFromDateString(dateString),
        }
      });

      const startDate: Date = getDateFromDateString(startDateString);
      const endDate: Date = getDateFromDateString(endDateString);

      return {
        startDate: startDate,
        endDate: endDate,
        maxValue: maxValue,
        minValue: minValue,
        data: chartData,
      }
    }
  };
}