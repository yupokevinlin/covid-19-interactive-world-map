export interface PopulationData {
  LocID: number;
  Location: string;
  Time: number;
  PopTotal: number;
}

export interface PopulationObject {
  [name: string]: PopulationData;
}