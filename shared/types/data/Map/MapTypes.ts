export interface MapPolygon {
  name: Array<string>;
  hierarchicalName: string;
  countryCode: string;
  geometry: Array<Array<[number, number]>>;
  hasChildren: boolean;
}

export interface MapPolygonsObject {
  [hierarchicalName: string]: Array<MapPolygon>;
}