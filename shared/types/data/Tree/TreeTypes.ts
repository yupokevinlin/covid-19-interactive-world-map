export interface TreeItem {
  hierarchicalName: string;
  countryCode?: string;
  children: Array<TreeItem>;
}