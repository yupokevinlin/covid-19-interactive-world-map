import {ServerMapPolygon, ServerMapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
const mapLayer0: any = require("../../../../data/map/gadm/gadm36_0-simplified.json");
const mapLayer1: any = require("../../../../data/map/gadm/gadm36_1-simplified.json");
const mapLayer2: any = require("../../../../data/map/gadm/gadm36_2-simplified.json");
import * as fs from "fs";
import {getHierarchicalName} from "../../../../shared/helpers/General";
const countries = require("i18n-iso-countries");

export namespace MapUtils {
  export const getGeometryFromGADMGeometry = (geometry: any, type: string): Array<Array<[number, number]>> => {
    return type === "MultiPolygon" ?
      geometry.map((e: Array<Array<Array<[number, number]>>>) => (e[0].map((e: Array<[number, number]>) => e.map((e: [number, number]) => e)))) :
      geometry;
  };

  export const correctCountryCode = (countryCode: string): string => {
    switch (countryCode) {
      case "XKO": {
        return "XKX";
      }
      default: {
        return countryCode;
      }
    }
  };

  export const convertMapData = (): void => {
    const featureFilterCallback = (feature: any): boolean => {
      return countries.getName(correctCountryCode(feature.properties.GID_0), "en");
    };
    const layer0Features: Array<any> = mapLayer0.features;
    const layer0CountriesWithChildren: Array<string> = ["Australia", "Canada", "China", "United States of America"];
    const layer0: Array<ServerMapPolygon> = layer0Features.filter(featureFilterCallback).map(feature => {
      const countryCode: string = correctCountryCode(feature.properties.GID_0);
      const countryName: string = countries.getName(countryCode, "en");

      const name: Array<string> = ["World", countryName];
      const hierarchicalName: string = getHierarchicalName(name);
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      const hasChildren: boolean = layer0CountriesWithChildren.includes(countryName);
      return {
        name: name,
        hierarchicalName: hierarchicalName,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: hasChildren,
      };
    });

    const layer1Features: Array<any> = mapLayer1.features;
    const layer1CountriesWithChildren: Array<string> = ["United States of America"];
    const layer1: Array<ServerMapPolygon> = layer1Features.filter(featureFilterCallback).map(feature => {
      const countryCode: string = correctCountryCode(feature.properties.GID_0);
      const countryName: string = countries.getName(countryCode, "en");
      const name: Array<string> = ["World", countryName, feature.properties.NAME_1];
      const hierarchicalName: string = getHierarchicalName(name);
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      const hasChildren: boolean = layer1CountriesWithChildren.includes(countryName);
      return {
        name: name,
        hierarchicalName: hierarchicalName,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: hasChildren,
      };
    });
    const layer2Features: Array<any> = mapLayer2.features;
    const layer2CountriesWithChildren: Array<string> = [];
    const layer2: Array<ServerMapPolygon> = layer2Features.filter(featureFilterCallback).map(feature => {
      const countryCode: string = correctCountryCode(feature.properties.GID_0);
      const countryName: string = countries.getName(countryCode, "en");
      const name: Array<string> = ["World", countryName, feature.properties.NAME_1, feature.properties.NAME_2];
      const hierarchicalName: string = getHierarchicalName(name);
      const geometry: Array<Array<[number, number]>> = getGeometryFromGADMGeometry(feature.geometry.coordinates, feature.geometry.type);
      const hasChildren: boolean = layer2CountriesWithChildren.includes(countryName);
      return {
        name: name,
        hierarchicalName: hierarchicalName,
        countryCode: countryCode,
        geometry: geometry,
        hasChildren: hasChildren,
      };
    });

    const layer1Object: ServerMapPolygonsObject = {};
    layer1.forEach(layer => {
      const layerName: Array<string> = [layer.name[0], layer.name[1]];
      const layerHierarchicalName: string = getHierarchicalName(layerName);
      if (!layer1Object[layerHierarchicalName]) {
        layer1Object[layerHierarchicalName] = [layer];
      } else {
        layer1Object[layerHierarchicalName].push(layer);
      }
    });
    const layer2Object: ServerMapPolygonsObject = {};
    layer2.forEach(layer => {
      const layerName: Array<string> = [layer.name[0], layer.name[1], layer.name[2]];
      const layerHierarchicalName: string = getHierarchicalName(layerName);
      if (!layer2Object[layerHierarchicalName]) {
        layer2Object[layerHierarchicalName] = [layer];
      } else {
        layer2Object[layerHierarchicalName].push(layer);
      }
    });

    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_0_processed_array.json", JSON.stringify(layer0), () => {});
    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_1_processed_object.json", JSON.stringify(layer1Object), () => {});
    fs.writeFile("C:\\Private Repository\\covid-19-interactive-world-map\\data\\map\\gadm\\gadm36_2_processed_object.json", JSON.stringify(layer2Object), () => {});
  };
}


