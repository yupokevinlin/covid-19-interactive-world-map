import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../state/store";
import styled from "styled-components";
import NavigationContainer from "../display/containers/NavigationContainer/NavigationContainer";

export interface AppProps {}

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const App: React.FC<AppProps> = props => {
  return (
    <Provider store={configureStore()}>
      <StyledApp className={"app"}>
        <NavigationContainer/>
      </StyledApp>
    </Provider>
  );
};

export default App;
