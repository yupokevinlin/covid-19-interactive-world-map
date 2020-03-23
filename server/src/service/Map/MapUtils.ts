import {ServerMapPolygon, ServerMapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
const mapLayer0: any = require("../../../../data/map/gadm/gadm36_0-simplified.json");
const mapLayer1: any = require("../../../../data/map/gadm/gadm36_1-simplified.json");
const mapLayer2: any = require("../../../../data/map/gadm/gadm36_2-simplified.json");
import * as fs from "fs";
const countries = require("i18n-iso-countries");

export namespace MapUtils {
  export const getGeometryFromGADMGeometry = (geometry: any, type: string): Array<Array<[number, number]>> => {
    return type === "MultiPolygon" ?
      geometry.map((e: Array<Array<Array<[number, number]>>>) => (e[0].map((e: Array<[number, number]>) => e.map((e: [number, number]) => e)))) :
      geometry;
  };

  export const convertMapData = (): void => {
    const layer0Features: Array<any> = mapLayer0.features;
    const layer0: Array<ServerMapPolygon> = layer0Features.map(feature => {
      const countryCode: string = feature.properties.GID_0;
      const countryName: string = countries.getName(feature.properties.GID_0, "en");
      const name: Array<string> = [countryName];
      const type: string = "Country";
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      return {
        name: name,
        type: type,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: false
      };
    });
    const layer1Features: Array<any> = mapLayer1.features;
    const layer1: Array<ServerMapPolygon> = layer1Features.map(feature => {
      const countryCode: string = feature.properties.GID_0;
      const countryName: string = countries.getName(feature.properties.GID_0, "en");
      const name: Array<string> = [countryName, feature.properties.NAME_1];
      const type: string = feature.ENGTYPE_1;
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      return {
        name: name,
        type: type,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: false
      };
    }).filter(layer => layer.name[0] !== "Taiwan");
    const layer2Features: Array<any> = mapLayer2.features;
    const layer2: Array<ServerMapPolygon> = layer2Features.map(feature => {
      if (feature.properties.NAME_0 === "Taiwan") {
        const countryCode: string = feature.properties.GID_0;
        const countryName: string = countries.getName(feature.properties.GID_0, "en");
        const name: Array<string> = [countryName, feature.properties.NAME_2];
        const type: string = feature.properties.ENGTYPE_2;
        const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
        layer1.push({
          name: name,
          type: type,
          countryCode: countryCode,
          geometry: geometry,
          hasChildren: false
        });
      }
      const countryCode: string = feature.properties.GID_0;
      const countryName: string = countries.getName(feature.properties.GID_0, "en");
      const name: Array<string> = [countryName, feature.properties.NAME_1, feature.properties.NAME_2];
      const type: string = feature.properties.ENGTYPE_2;
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      return {
        name: name,
        type: type,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: false
      };
    }).filter(layer => layer.name[0] !== "Taiwan");
    const processedLayer0: Array<ServerMapPolygon> = layer0.map(layer => {
      let hasChildren: boolean = false;
      layer1.forEach(childLayer => {
        if (JSON.stringify([childLayer.name[0]]) === JSON.stringify(layer.name)) {
          hasChildren = true;
        }
      });
      return {
        ...layer,
        hasChildren: hasChildren
      }
    });
    const processedLayer1: Array<ServerMapPolygon> = layer1.map(layer => {
      let hasChildren: boolean = false;
      layer2.forEach(childLayer => {
        if (JSON.stringify([childLayer.name[0], childLayer.name[1]]) === JSON.stringify(layer.name)) {
          hasChildren = true;
        }
      });
      return {
        ...layer,
        hasChildren: hasChildren
      }
    });


    const layer1Object: ServerMapPolygonsObject = {};
    processedLayer1.forEach(layer => {
      const layerName: string = JSON.stringify([layer.name[0]]);
      if (!layer1Object[layerName]) {
        layer1Object[layerName] = [layer];
      } else {
        layer1Object[layerName].push(layer);
      }
    });
    const layer2Object: ServerMapPolygonsObject = {};
    layer2.forEach(layer => {
      const layerName: string = JSON.stringify([layer.name[0], layer.name[1]]);
      if (!layer2Object[layerName]) {
        layer2Object[layerName] = [layer];
      } else {
        layer2Object[layerName].push(layer);
      }
    });

    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_0_processed_array.json", JSON.stringify(processedLayer0), () => {});
    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_1_processed_object.json", JSON.stringify(layer1Object), () => {});
    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_2_processed_object.json", JSON.stringify(layer2Object), () => {});
  };
}


