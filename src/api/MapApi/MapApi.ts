import WorldOutlineJson from "../../../data/map/WorldOutline.json";
import { CountryOutline, CountryOutlineName, LatLon } from "./types";

export namespace MapApi {
  export const getCountryOutlines = (): Array<CountryOutline> => {
    const countryOutlines: Array<CountryOutline> = [];
    WorldOutlineJson.features.forEach(feature => {
      const properties: any = feature.properties;
      const name: CountryOutlineName = {
        ar: properties.NAME_AR,
        bn: properties.NAME_BN,
        de: properties.NAME_DE,
        en: properties.NAME_EN,
        es: properties.NAME_ES,
        fr: properties.NAME_FR,
        el: properties.NAME_EL,
        hi: properties.NAME_HI,
        hu: properties.NAME_HU,
        id: properties.NAME_ID,
        it: properties.NAME_IT,
        ja: properties.NAME_JA,
        ko: properties.NAME_KO,
        nl: properties.NAME_NL,
        pl: properties.NAME_PL,
        pt: properties.NAME_PT,
        ru: properties.NAME_RU,
        sv: properties.NAME_SV,
        tr: properties.NAME_TR,
        vi: properties.NAME_VI,
        zh: properties.NAME_ZH,
      };

      const dataGeometry: any = feature.geometry;
      const geometry: Array<Array<LatLon>> = [];
      const coordinatesArray: Array<any> = dataGeometry.coordinates;
      const type: string = dataGeometry.type;
      switch (type) {
        case "Polygon": {
          coordinatesArray.forEach(coordinates => {
            const polygon: Array<LatLon> = [];
            coordinates.forEach(coordinate => {
              polygon.push({
                lat: coordinate[1],
                lon: coordinate[0],
              });
            });
            geometry.push(polygon);
          });
          break;
        }
        case "MultiPolygon": {
          coordinatesArray.forEach(array => {
            const polygon: Array<LatLon> = [];
            array.forEach(coordinates => {
              coordinates.forEach(coordinate => {
                polygon.push({
                  lat: coordinate[1],
                  lon: coordinate[0],
                });
              });
            });
            geometry.push(polygon);
          });
          break;
        }
        default: {
        }
      }

      const countryOutline: CountryOutline = {
        name: name,
        geometry: geometry,
        countryCode: properties.ISO_A2,
      };

      countryOutlines.push(countryOutline);
    });

    return countryOutlines;
  };
}
