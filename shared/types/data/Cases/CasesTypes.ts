export interface ServerDailyCasesDataObject {
  [date: string]: ServerDailyCasesData;
}

export interface ServerDailyCasesData {
  date: string;
  deaths: number;
  confirmedCases: number;
  recoveredCases: number;
}

export interface ServerTimeSeriesCasesData {
  name: Array<string>;
  hasChildren: boolean;
  data: ServerDailyCasesDataObject;
}

export interface ServerTimeSeriesCasesDataObject {
  [name: string]: ServerTimeSeriesCasesData;
}