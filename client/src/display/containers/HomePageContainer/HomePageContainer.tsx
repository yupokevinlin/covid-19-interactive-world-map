import React, {useEffect} from "react";
import HomePage from "../../pages/HomePage";
import {AppActionTypes, AppState} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {MapPageActionTypes} from "../../../state/containers/MapPageContainer/types";
import {HomePageActionTypes, HomePageState} from "../../../state/containers/HomePageContainer/types";
import {HomePageAction} from "../../../state/containers/HomePageContainer/actions";

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
  const homePageState: HomePageState = useSelector<Store, HomePageState>(store => store.homePage, shallowEqual);
  const homePageDispatch: Dispatch<HomePageAction> = useDispatch<Dispatch<HomePageAction>>();

  useEffect(() => {
    homePageDispatch({
      type: HomePageActionTypes.INIT,
    });
  }, []);

  return (
    <HomePage/>
  )
};

export default HomePageContainer;

