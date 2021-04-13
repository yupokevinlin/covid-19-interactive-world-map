import React from "react";
import ChartPage from "../../pages/ChartPage";
import {AppActionTypes, AppState} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

export type ChartPageContainerProps = ChartPageContainerDataProps & ChartPageContainerStyleProps & ChartPageContainerEventProps;

export interface ChartPageContainerDataProps {

}

export interface ChartPageContainerStyleProps {

}

export interface ChartPageContainerEventProps {

}

const ChartPageContainer: React.FC<ChartPageContainerProps> = (props) => {
  const appState: AppState = useSelector<Store, AppState>(store => store.app, shallowEqual);
  const appDispatch: Dispatch<AppAction> = useDispatch<Dispatch<AppAction>>();

  const handleLoaded = (): void => {
    appDispatch({
      type: AppActionTypes.SET_IS_LOADING,
      isLoading: false,
    });
  };

  return (
    <ChartPage handleLoaded={handleLoaded}/>
  )
};

export default ChartPageContainer;

