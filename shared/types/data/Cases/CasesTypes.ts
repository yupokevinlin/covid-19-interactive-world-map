export interface ServerCasesDataTimeSeries {
  [date: string]: ServerCasesDataObject;
}

export interface ServerCasesData {
  name: Array<string>;
  deaths: number;
  confirmedCases: number;
  recoveredCases: number;
}

export interface ServerCasesDataObject {
  [name: string]: ServerCasesData;
}