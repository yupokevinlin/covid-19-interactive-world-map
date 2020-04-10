import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../state/store";
import styled from "styled-components";
import MapPageContainer from "../display/containers/MapPageContainer";
import PageWrapperContainer from "../display/containers/PageWrapperContainer";
import { createMuiTheme, Theme } from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

export interface AppProps {}

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const App: React.FC<AppProps> = props => {
  const theme: Theme = createMuiTheme();
  return (
    <Provider store={configureStore()}>
      <StyledApp className={"app"}>
        <ThemeProvider theme={theme}>
          <PageWrapperContainer/>
        </ThemeProvider>
      </StyledApp>
    </Provider>
  );
};

export default App;
