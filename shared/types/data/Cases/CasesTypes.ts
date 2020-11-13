export interface ServerCasesData {
  name: Array<string>;
  hierarchicalName: string;
  countryCode: string;
  isMissingData: boolean;
  data: ServerDailyCasesDataObject;
}

export interface ServerDailyCasesDataObject {
  [date: string]: ServerDailyCasesData;
}

export interface ServerDailyCasesData {
  population: number;
  totalCases: number;
  totalRecoveries: number;
  totalDeaths: number;
}

export interface ServerCasesDataObject {
  [hierarchicalName: string]: ServerCasesData;
}