import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import {MapPolygon, MapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
import {getHierarchicalName, getNameArray} from "../../../../shared/helpers/General";
import {CasesDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "../Cases/CasesUtils";
const mapLayer0: Array<MapPolygon> = require("../../../../data/map/gadm/gadm36_0_processed_array.json");
const mapLayer1: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_1_processed_object.json");
const mapLayer2: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_2_processed_object.json");

export namespace TreeUtils {
  export let data: TreeItem = {
    hierarchicalName: "World",
    countryCode: "World",
    children: [],
  };
  export const getTreeData = (): void => {
    const casesData: CasesDataObject = CasesUtils.data;
    //Add layer 0
    mapLayer0.forEach((layer) => {
      if (hasCasesData(casesData, layer.hierarchicalName)) {
        data.children.push({
          hierarchicalName: layer.hierarchicalName,
          countryCode: layer.countryCode,
          children: [],
        });
      }
    });

    //Add layer 1
    Object.entries(mapLayer1).forEach(([layer0HierarchicalName, layer1MapPolygons]) => {
      const matchingLayer0Item: TreeItem | undefined = data.children.find((treeItem) => treeItem.hierarchicalName === layer0HierarchicalName);
      layer1MapPolygons.forEach((layer1MapPolygon) => {
        if (matchingLayer0Item) {
          if (hasCasesData(casesData, layer1MapPolygon.hierarchicalName)) {
            matchingLayer0Item.children.push({
              hierarchicalName: layer1MapPolygon.hierarchicalName,
              children: [],
            });
          }
        }
      });
    });

    //Add layer 2
    Object.entries(mapLayer2).forEach(([layer1HierarchicalName, layer2MapPolygons]) => {
      const layer1Name: Array<string> = getNameArray(layer1HierarchicalName);
      const layer0HierarchicalName: string = getHierarchicalName([layer1Name[0], layer1Name[1]]);
      const matchingLayer0Item: TreeItem | undefined = data.children.find((treeItem) => treeItem.hierarchicalName === layer0HierarchicalName);
      if (matchingLayer0Item) {
        const matchingLayer1Item: TreeItem | undefined = matchingLayer0Item.children.find((treeItem) => treeItem.hierarchicalName === layer1HierarchicalName);
        if (matchingLayer1Item) {
          layer2MapPolygons.forEach((layer2MapPolygon) => {
            if (hasCasesData(casesData, layer2MapPolygon.hierarchicalName)) {
              matchingLayer1Item.children.push({
                hierarchicalName: layer2MapPolygon.hierarchicalName,
                children: [],
              });
            }
          });
        }
      }
    });

    //Sort
    const sortFunction = (a: TreeItem, b: TreeItem): number => {
      if (a.hierarchicalName > b.hierarchicalName) {
        return 1;
      }
      if (a.hierarchicalName < b.hierarchicalName) {
        return -1
      }
      return 0;
    };
    data.children.forEach((child1) => {
      child1.children.forEach((child2) => {
        child2.children = child2.children.sort(sortFunction);
      });
      child1.children = child1.children.sort(sortFunction);
    });
    data.children = data.children.sort(sortFunction);
  };

  const hasCasesData = (casesData: CasesDataObject, hierarchicalName: string): boolean => {
    return !!casesData[hierarchicalName];
  };
}