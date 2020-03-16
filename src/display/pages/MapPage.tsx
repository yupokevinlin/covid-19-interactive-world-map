import React from "react";
import ESRIMap, { MapPolygon } from "../components/ESRIMap/ESRIMap";
import { CountryOutline, LatLon } from "../../api/MapApi/types";
import { MapApi } from "../../api/MapApi/MapApi";

export interface MapPageProps {}

const MapPage: React.FC<MapPageProps> = props => {
  const countryOutlines: Array<CountryOutline> = MapApi.getCountryOutlines();
  const testNumbers: Array<number> = [
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    10,
    10,
    10,
    10,
    10,
    10,
    100,
    100,
    100,
    1000,
    1000,
    100000,
    1000000,
  ];
  const mapPolygons: Array<MapPolygon> = countryOutlines.map((countryOutline, index) => {
    const cases: number = testNumbers[Math.floor(Math.random() * testNumbers.length)];
    return {
      internalId: index,
      name: countryOutline.name.en,
      confirmedCasesCount: cases,
      geometry: countryOutline.geometry,
    };
  });
  return <ESRIMap mapPolygons={mapPolygons} />;
};

export default MapPage;
