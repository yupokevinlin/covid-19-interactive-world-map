
export interface PageWrapperContainerState {
  currentPage: PageName;
}

export enum PageWrapperContainerActionTypes {
  INITIALIZE = "page.INITIALIZE",
  SET_PAGE_WRAPPER_CONTAINER_STATE = "page.SET_PAGE_WRAPPER_CONTAINER_STATE"
}

export enum PageName {
  Home = "Home",
  CurrentMap = "Map"
}