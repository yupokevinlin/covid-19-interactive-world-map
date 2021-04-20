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
}

export interface DailyCasesInformationDataNull {
  cases: null;
  recoveries: null;
  deaths: null;
}
