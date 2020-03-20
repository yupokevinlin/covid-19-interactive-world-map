export interface ServerMapPolygon {
  name: Array<string>;
  type: string;
  countryCode: string;
  geometry: Array<Array<[number, number]>>;
}
