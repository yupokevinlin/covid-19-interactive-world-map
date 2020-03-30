export interface ServerMapPolygon {
  name: Array<string>;
  type: string;
  countryCode: string;
  geometry: Array<Array<[number, number]>>;
  hasChildren: boolean;
  hidden?: boolean;
}

export interface ServerMapPolygonsObject {
  [name: string]: Array<ServerMapPolygon>;
}