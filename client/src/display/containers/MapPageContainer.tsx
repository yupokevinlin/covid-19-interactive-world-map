import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import MapPage from "../pages/MapPage";
import { MapPageContainerActionTypes, MapPageContainerState } from "../../state/containers/MapPageContainer/types";
import { Store } from "../../state/store";
import { CountDisplayButtonClickEvent } from "../components/CountDisplayButton/CountDisplayButton";
import { ListMenuSelectEvent } from "../components/ListMenu/ListMenuItem/ListMenuItem";
import { MapPageContainerAction } from "../../state/containers/MapPageContainer/action";

export interface MapPageContainerProps {}

const MapPageContainer: React.FC<MapPageContainerProps> = props => {
  const state: MapPageContainerState = useSelector<Store, MapPageContainerState>(store => store.map, shallowEqual);
  const dispatch: Dispatch<MapPageContainerAction> = useDispatch<Dispatch<MapPageContainerAction>>();

  useEffect(() => {
    dispatch({
      type: MapPageContainerActionTypes.INITIALIZE,
    });
  }, []);

  const handleCountDisplayTypeChange = (event: CountDisplayButtonClickEvent): void => {
    dispatch({
      type: MapPageContainerActionTypes.HANDLE_COUNT_DISPLAY_TYPE_CHANGE,
      event: event,
    });
  };

  const handleRegionSelect = (event: ListMenuSelectEvent): void => {
    dispatch({
      type: MapPageContainerActionTypes.HANDLE_REGION_CHANGE,
      event: event,
    });
  };

  if (!state.isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <MapPage
        displayedConfirmedCasesCount={state.displayedConfirmedCasesCount}
        displayedRecoveredCasesCount={state.displayedRecoveredCasesCount}
        displayedDeathsCount={state.displayedDeathsCount}
        language={state.language}
        layer={state.currentLayer}
        name={state.currentName}
        mapPolygonData={state.mapPolygonData}
        regionSelectData={state.regionSelectData}
        enableMapPopup={state.enableMapPopup}
        handleCountDisplayTypeChange={handleCountDisplayTypeChange}
        handleRegionSelect={handleRegionSelect}
      />
    );
  }
};

export default MapPageContainer;
