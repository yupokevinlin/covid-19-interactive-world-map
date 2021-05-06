export interface CasesData {
  name: Array<string>;
  hierarchicalName: string;
  countryCode: string;
  isMissingData: boolean;
  population: number;
  data: DailyCasesDataObject;
}

export interface DailyCasesDataObject {
  [date: string]: DailyCasesData;
}

export interface DailyCasesData {
  totalCases: number;
  totalRecoveries: number;
  totalDeaths: number;
}

export interface DailyCasesDataNull {
  totalCases: null;
  totalRecoveries: null;
  totalDeaths: null;
}

export interface CasesDataObject {
  [hierarchicalName: string]: CasesData;
}

export interface CasesInformationDataObject {
  [hierarchicalName: string]: DailyCasesInformationDataObject;
}

export interface DailyCasesInformationDataObject {
  [date: string]: DailyCasesInformationData;
}

export interface DailyCasesInformationData {
  cases: number;
  recoveries: number;
  deaths: number;
  weeklyCasesAverage?: number;
  monthlyCasesAverage?: number;
  yearlyCasesAverage?: number;
  weeklyRecoveriesAverage?: number;
  monthlyRecoveriesAverage?: number;
  yearlyRecoveriesAverage?: number;
  weeklyDeathsAverage?: number;
  monthlyDeathsAverage?: number;
  yearlyDeathsAverage?: number;
}

export interface DailyCasesInformationDataNull {
  cases: null;
  recoveries: null;
  deaths: null;
}

export interface CurrentCasesSummary {
  currentDate: string;
  world: WorldSummary;
  countries: CasesSummary;
}

export interface WorldSummary {
  daily: WorldSummaryData;
  weekly: WorldSummaryData;
  monthly: WorldSummaryData;
  yearly: WorldSummaryData;
}

export interface WorldSummaryData {
  cases: number;
  deaths: number;
  casesChange: number;
  deathsChange: number;
  casesChangePercentage: number;
  deathsChangePercentage: number;
}

export interface CasesSummary {
  dailyCases: Array<CasesSummaryData>;
  dailyCasesChange: Array<CasesSummaryData>;
  dailyDeaths: Array<CasesSummaryData>;
  dailyDeathsChange: Array<CasesSummaryData>;
}

export interface CasesSummaryData {
  name: string;
  countryCode: string;
  count: number;
  change: number;
  changePercentage: number;
}
