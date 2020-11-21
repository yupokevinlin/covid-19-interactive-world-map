export const getHierarchicalName = (name: Array<string>): string => {
  return name.join(".");
};

export const getNameArray = (hierarchicalName: string): Array<string> => {
  return hierarchicalName.split(".");
};