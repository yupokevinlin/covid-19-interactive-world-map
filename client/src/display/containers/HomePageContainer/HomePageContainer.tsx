import React from "react";
import HomePage from "../../pages/HomePage";
import {AppActionTypes, AppState} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

export type HomePageContainerProps = HomePageContainerDataProps & HomePageContainerStyleProps & HomePageContainerEventProps;

export interface HomePageContainerDataProps {

}

export interface HomePageContainerStyleProps {

}

export interface HomePageContainerEventProps {

}

const HomePageContainer: React.FC<HomePageContainerProps> = (props) => {
  const appState: AppState = useSelector<Store, AppState>(store => store.app, shallowEqual);
  const appDispatch: Dispatch<AppAction> = useDispatch<Dispatch<AppAction>>();

  const handleLoaded = (): void => {
    appDispatch({
      type: AppActionTypes.SET_IS_LOADING,
      isLoading: false,
    });
  };

  return (
    <HomePage handleLoaded={handleLoaded}/>
  )
};

export default HomePageContainer;

