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

export interface CasesDataObject {
  [hierarchicalName: string]: CasesData;
}