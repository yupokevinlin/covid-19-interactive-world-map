import React, {useEffect, useState} from "react";
import MapPage from "../../pages/MapPage";
import {AppActionTypes, AppState, CasesDataTypes, MapSubPages} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MapPageActionTypes, MapPageState} from "../../../state/containers/MapPageContainer/types";
import {MapPageAction} from "../../../state/containers/MapPageContainer/actions";
import {DateUtils} from "../../../helper/DateUtils";
import {withWidth} from "@material-ui/core";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
export type MapPageContainerProps = MapPageContainerDataProps & MapPageContainerStyleProps & MapPageContainerEventProps;

export interface MapPageContainerDataProps {

}

export interface MapPageContainerStyleProps {
  width: Breakpoint;
}

export interface MapPageContainerEventProps {

}

const MapPageContainer: React.FC<MapPageContainerProps> = (props) => {
  const appState: AppState = useSelector<Store, AppState>(store => store.app, shallowEqual);
  const appDispatch: Dispatch<AppAction> = useDispatch<Dispatch<AppAction>>();
  const mapPageState: MapPageState = useSelector<Store, MapPageState>(store => store.mapPage, shallowEqual);
  const mapPageDispatch: Dispatch<MapPageAction> = useDispatch<Dispatch<MapPageAction>>();

  useEffect(() => {
    if (!!appState.casesDataObject) {
      mapPageDispatch({
        type: MapPageActionTypes.INIT,
      });
    }
  }, []);

  const {
    width,
  } = props;

  const [date, setDate] = useState<string>(DateUtils.getPreviousDate());
  const [region, setRegion] = useState<string>("World");

  const handleDateChange = (date: string): void => {
    setDate(date);
  };

  const handleMapRegionChange = (hierarchicalName: string): void => {
    setRegion(hierarchicalName);
    mapPageDispatch({
      type: MapPageActionTypes.HANDLE_MAP_REGION_CHANGE,
      hierarchicalName: hierarchicalName,
    });
  };

  const handleBreadcrumbsRegionChange = (hierarchicalName: string): void => {
    setRegion(hierarchicalName);
    mapPageDispatch({
      type: MapPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE,
      hierarchicalName: hierarchicalName,
    });
  };

  const handleMapUpdateStart = (): void => {
    appDispatch({
      type: AppActionTypes.SET_IS_LOADING,
      displayLoadingBar: true,
      displayLoadingPage: false,
    });
  };

  const handleMapUpdateComplete = (): void => {
    appDispatch({
      type: AppActionTypes.SET_IS_LOADING,
      displayLoadingBar: false,
      displayLoadingPage: false,
    });
  };

  const handlePreloadClick = (value: string): void => {
    appDispatch({
      type: AppActionTypes.HANDLE_START_CASES_INFORMATION_DATA_OBJECT_LOAD,
      casesDataType: value as CasesDataTypes,
    })
  };

  if (!!appState.casesDataObject) {
    return (
      <MapPage dateValues={mapPageState.dateValues} dataTree={appState.dataTree} mapPolygons={mapPageState.mapPolygons} date={date} mapRegionUpdateGeometry={mapPageState.mapRegionUpdateGeometry} breadcrumbsRegionUpdateGeometry={mapPageState.breadcrumbsRegionUpdateGeometry} subPage={appState.subPage as MapSubPages} casesData={appState.casesDataObject[region]} countryCode={mapPageState.countryCode} regionName={region} casesDataObject={appState.casesDataObject} dailyCasesInformationDataObject={appState.dailyCasesInformationDataObject} weeklyCasesInformationDataObject={appState.weeklyCasesInformationDataObject} monthlyCasesInformationDataObject={appState.monthlyCasesInformationDataObject} yearlyCasesInformationDataObject={appState.yearlyCasesInformationDataObject} width={width} handleDateChange={handleDateChange} handleMapRegionChange={handleMapRegionChange} handleBreadCrumbsRegionChange={handleBreadcrumbsRegionChange} handleMapUpdateStart={handleMapUpdateStart} handleMapUpdateComplete={handleMapUpdateComplete} handlePreloadClick={handlePreloadClick}/>
    );
  } else {
    return null;
  }
};

export default withWidth()(MapPageContainer);

