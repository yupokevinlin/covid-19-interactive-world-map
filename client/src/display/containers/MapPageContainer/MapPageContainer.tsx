import React, {useEffect, useState} from "react";
import MapPage from "../../pages/MapPage";
import {AppState} from "../../../state/global/App/types";
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
    mapPageDispatch({
      type: MapPageActionTypes.INIT,
    });
  }, []);

  const [date, setDate] = useState<string>(DateUtils.getCurrentDate());

  const handleDateChange = (date: string): void => {
    setDate(date);
  };

  return (
    <MapPage dateValues={mapPageState.dateValues} handleDateChange={handleDateChange}/>
  );
};

export default MapPageContainer;

