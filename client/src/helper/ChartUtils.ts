import {
  CasesData,
  CasesDataObject,
  CasesInformationDataObject, DailyCasesData,
  DailyCasesDataObject,
  DailyCasesInformationDataObject
} from "../../../shared/types/data/Cases/CasesTypes";
import {
  ChartLineChartAverageData,
  ChartLineChartData,
} from "../display/components/ChartPageLineChart/ChartPageLineChart";
import {ChartPageLineChartAverageData, ChartPageLineChartData} from "../display/components/ChartPageLineChart/types";
import {CasesDataTypes, CasesTypes} from "../state/global/App/types";
import {DateUtils} from "./DateUtils";
import {getName} from "../../../shared/helpers/General";

export namespace ChartUtils {
  import getDateFromDateString = DateUtils.getDateFromDateString;
  export const getChartPageLineChartDataPropsFromCasesDataObject = (casesDataObject: CasesDataObject, hierarchicalName: string, caseType: CasesTypes, countryCode: string): ChartLineChartData => {
    const matchingCasesData: CasesData | null = casesDataObject[hierarchicalName];
    const data: ChartLineChartData = {
      maxValue: 0,
      minValue: 0,
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      title: "",
      yAxisLabel: "",
      xAxisLabel: "",
      yAxisTooltip: "",
      xAxisTooltip: "",
      countryCode: "",
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
        switch (caseType) {
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

      let yLabel: string = "";
      let yTooltip: string = "";

      switch (caseType) {
        case CasesTypes.CASES: {
          yLabel = "Total Cases";
          yTooltip = "Cases";
          break;
        }
        case CasesTypes.DEATHS: {
          yLabel = "Total Deaths";
          yTooltip = "Deaths";
          break;
        }
        case CasesTypes.RECOVERIES: {
          yLabel = "Total Recoveries";
          yTooltip = "Recoveries";
          break;
        }
      }

      const name: string = getName(hierarchicalName);
      const title: string = `${name} - ${yLabel}`;
      return {
        startDate: startDate,
        endDate: endDate,
        maxValue: maxValue,
        minValue: minValue,
        data: chartData,
        title: title,
        yAxisLabel: yLabel,
        xAxisLabel: "Date",
        yAxisTooltip: yTooltip,
        xAxisTooltip: "Date",
        countryCode: countryCode,
      }
    }
  };
  export const getChartPageLineChartDataPropsFromDailyCasesInformationDataObject = (casesInformationDataObject: CasesInformationDataObject, hierarchicalName: string, caseType: CasesTypes, countryCode: string): ChartLineChartAverageData => {
    const matchingCasesInformationData: DailyCasesInformationDataObject | null = casesInformationDataObject[hierarchicalName];
    const data: ChartLineChartAverageData = {
      maxValue: 0,
      minValue: 0,
      startDate: new Date(),
      endDate: new Date(),
      data: [],
      title: "",
      yAxisLabel: "",
      xAxisLabel: "",
      yAxisTooltip: "",
      xAxisTooltip: "",
      yAxisAverageTooltip: "",
      countryCode: "",
    };
    if (!matchingCasesInformationData) {
      return data;
    } else {
      const matchingDailyCasesInformationData: DailyCasesInformationDataObject = matchingCasesInformationData;

      let maxValue: number = 0;
      let minValue: number = 0;
      let startDateString: string = "";
      let endDateString: string = "";
      const chartData: Array<ChartPageLineChartAverageData> = Object.entries(matchingDailyCasesInformationData).map(([dateString, dailyCasesInformationData], index) => {
        let number: number = 0;
        let average: number = 0;
        switch (caseType) {
          case CasesTypes.CASES: {
            number = dailyCasesInformationData.cases;
            average = dailyCasesInformationData.weeklyCasesAverage;
            break;
          }
          case CasesTypes.DEATHS: {
            number = dailyCasesInformationData.deaths;
            average = dailyCasesInformationData.weeklyDeathsAverage;
            break;
          }
          case CasesTypes.RECOVERIES: {
            number = dailyCasesInformationData.recoveries;
            average = dailyCasesInformationData.weeklyRecoveriesAverage;
            break;
          }
        }
        if (index === 0) {
          startDateString = dateString;
        } else if (index === Object.keys(matchingDailyCasesInformationData).length - 1) {
          endDateString = dateString;
        }
        maxValue = Math.max(maxValue, number);
        minValue = Math.min(minValue, number);
        return {
          value: number,
          average: average,
          date: getDateFromDateString(dateString),
        }
      });

      const startDate: Date = getDateFromDateString(startDateString);
      const endDate: Date = getDateFromDateString(endDateString);

      let yLabel: string = "";
      let yTooltip: string = "";
      let yAxisAverageTooltip: string = "";

      switch (caseType) {
        case CasesTypes.CASES: {
          yLabel = "Daily Cases";
          yTooltip = "Cases";
          yAxisAverageTooltip = "7 Day Avg."
          break;
        }
        case CasesTypes.DEATHS: {
          yLabel = "Daily Deaths";
          yTooltip = "Deaths";
          yAxisAverageTooltip = "7 Day Avg."
          break;
        }
        case CasesTypes.RECOVERIES: {
          yLabel = "Daily Recoveries";
          yTooltip = "Recoveries";
          yAxisAverageTooltip = "7 Day Avg."
          break;
        }
      }

      const name: string = getName(hierarchicalName);
      const title: string = `${name} - ${yLabel}`;

      return {
        startDate: startDate,
        endDate: endDate,
        maxValue: maxValue,
        minValue: minValue,
        data: chartData,
        title: title,
        yAxisLabel: yLabel,
        xAxisLabel: "Date",
        yAxisTooltip: yTooltip,
        xAxisTooltip: "Date",
        yAxisAverageTooltip: yAxisAverageTooltip,
        countryCode: countryCode,
      }
    }
  };
}