import React from "react";
import MapPage from "../../pages/MapPage";
import {AppActionTypes, AppState} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

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

  const handleLoaded = (): void => {
    appDispatch({
      type: AppActionTypes.SET_IS_LOADING,
      isLoading: false,
    });
  };

  return (
    <MapPage handleLoaded={handleLoaded}/>
  )
};

export default MapPageContainer;

