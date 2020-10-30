export interface ServerMapPolygon {
  name: Array<string>;
  hierarchicalName: string;
  countryCode: string;
  geometry: Array<Array<[number, number]>>;
  hasChildren: boolean;
}

export interface ServerMapPolygonsObject {
  [name: string]: Array<ServerMapPolygon>;
}