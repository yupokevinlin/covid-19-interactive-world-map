import React, {useEffect, useState} from "react";
import MapPage from "../../pages/MapPage";
import {AppActionTypes, AppState, MapSubPages} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MapPageActionTypes, MapPageState} from "../../../state/containers/MapPageContainer/types";
import {MapPageAction} from "../../../state/containers/MapPageContainer/actions";
import {DateUtils} from "../../../helper/DateUtils";

export type MapPageContainerProps = MapPageContainerDataProps & MapPageContainerStyleProps & MapPageContainerEventProps;

export interface MapPageContainerDataProps {

}

export interface MapPageContainerStyleProps {

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

  const [date, setDate] = useState<string>(DateUtils.getCurrentDate());
  const [region, setRegion] = useState<string>("World");

  const handleDateChange = (date: string): void => {
    setDate(date);
  };

  const handleRegionChange = (hierarchicalName: string): void => {
    setRegion(hierarchicalName);
    mapPageDispatch({
      type: MapPageActionTypes.HANDLE_REGION_CHANGE,
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

  if (!!appState.casesDataObject) {
    return (
      <MapPage dateValues={mapPageState.dateValues} dataTree={appState.dataTree} mapPolygons={mapPageState.mapPolygons} date={date} focusMapGeometry={mapPageState.focusMapGeometry} subPage={appState.subPage as MapSubPages} handleDateChange={handleDateChange} handleRegionChange={handleRegionChange} handleMapUpdateStart={handleMapUpdateStart} handleMapUpdateComplete={handleMapUpdateComplete}/>
    );
  } else {
    return null;
  }
};

export default MapPageContainer;

