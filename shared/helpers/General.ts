import {TreeItem} from "../types/data/Tree/TreeTypes";

export const getHierarchicalName = (name: Array<string>): string => {
  return name.join("_");
};

export const getNameArray = (hierarchicalName: string): Array<string> => {
  return hierarchicalName.split("_");
};

export const getName = (hierarchicalName: string): string => {
  const nameArray: Array<string> = getNameArray(hierarchicalName);
  if (nameArray.length === 0) {
    return "";
  } else {
    return nameArray[nameArray.length - 1];
  }
};

export const getSequentialHierarchicalNames = (hierarchicalName: string): Array<string> => {
  const name: Array<string> = getNameArray(hierarchicalName);
  const hierarchicalNames: Array<string> = [];
  name.forEach((s, index) => {
    const currentName: Array<string> = [];
    for (let i = 0; i < index + 1; i++) {
      currentName.push(name[i]);
    }
    hierarchicalNames.push(getHierarchicalName(currentName));
  });
  return hierarchicalNames;
};

export const getTreeItem = (dataTree: TreeItem, hierarchicalName: string): TreeItem | undefined => {
  const name: Array<string> = getNameArray(hierarchicalName);
  let matchingItem: TreeItem | undefined = dataTree;
  let currentName: Array<string> = [];
  name.forEach((s, index) => {
    currentName.push(s);
    const currentHierarchicalName: string = getHierarchicalName(currentName);
    if (matchingItem) {
      if (matchingItem.hierarchicalName !== currentHierarchicalName) {
        matchingItem = matchingItem.children.find((child) => child.hierarchicalName === currentHierarchicalName);
      }
    }
  });
  return matchingItem;
};