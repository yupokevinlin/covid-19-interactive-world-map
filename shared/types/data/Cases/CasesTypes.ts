export interface ServerCasesData {
  name: Array<string>;
  hierarchicalName: string;
  countryCode: string;
  data: ServerDailyCasesDataObject;
}

export interface ServerDailyCasesDataObject {
  [date: string]: ServerDailyCasesData;
}

export interface ServerDailyCasesData {
  totalCases: number;
  totalRecoveries: number;
  totalDeaths: number;
}

export interface ServerCasesDataObject {
  [hierarchicalName: string]: ServerCasesData;
}