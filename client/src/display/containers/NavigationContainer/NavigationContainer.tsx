import React, {useEffect} from "react";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import {ThemeProvider} from "@material-ui/styles";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {createBrowserHistory, History} from "history";
import {withWidth} from "@material-ui/core";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Navigation from "../../components/Navigation/Navigation";
import {AppActionTypes, AppState, Pages, PageURLs, SubPages} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {AppAction} from "../../../state/global/App/actions";
import HomePageContainer from "../HomePageContainer/HomePageContainer";
import MapPageContainer from "../MapPageContainer/MapPageContainer";
import ChartPageContainer from "../ChartPageContainer/ChartPageContainer";
import LoadingPage from "../../pages/statelessPages/LoadingPage";



export type NavigationContainerProps = NavigationContainerDataProps & NavigationContainerStyleProps & NavigationContainerEventProps;

export interface NavigationContainerDataProps {

}

export interface NavigationContainerStyleProps {
  width: Breakpoint;
}

export interface NavigationContainerEventProps {

}

export const history: History = createBrowserHistory();

const NavigationContainer: React.FC<NavigationContainerProps> = (props) => {
  const {
    width,
  } = props;
  const appState: AppState = useSelector<Store, AppState>(store => store.app, shallowEqual);
  const appDispatch: Dispatch<AppAction> = useDispatch<Dispatch<AppAction>>();

  const pageTitle: string = `${appState.page}${appState.subPage ? ` - ${appState.subPage}` : ""}`;

  useEffect(() => {
    appDispatch({
      type: AppActionTypes.INIT,
    });
  }, []);

  const handleMenuItemClick = (page: Pages, history: History): void => {
    appDispatch({
      type: AppActionTypes.GO_TO_PAGE,
      page: page,
      subPage: null,
      history: history,
    });
  };

  const handleMenuItemChildClick = (page: Pages, subPage: SubPages, history: History): void => {
    appDispatch({
      type: AppActionTypes.GO_TO_PAGE,
      page: page,
      subPage: subPage,
      history: history,
    });
  };

  return (
    appState.isInitComplete ? (
      <ThemeProvider theme={appState.theme}>
        <Router history={history}>
          {
            <Navigation width={width} pageTitle={pageTitle} menuItems={appState.menuItems} version={appState.version} displayLoadingBar={appState.displayLoadingBar} displayLoadingPage={appState.displayLoadingPage} handleMenuItemClick={handleMenuItemClick} handleMenuItemChildClick={handleMenuItemChildClick}>
              <Route exact path={PageURLs.HOME}>
                <HomePageContainer/>
              </Route>
              <Route path={PageURLs.MAP}>
                <MapPageContainer/>
              </Route>
              <Route path={PageURLs.CHART}>
                <ChartPageContainer/>
              </Route>
            </Navigation>
          }
        </Router>
      </ThemeProvider>
    ) : (
      <LoadingPage width={width} text={"Loading data... Please wait."}/>
    )
  );
};

export default withWidth()(NavigationContainer);

