export const getHierarchicalName = (name: Array<string>): string => {
  return name.join("_");
};

export const getNameArray = (hierarchicalName: string): Array<string> => {
  return hierarchicalName.split("_");
};