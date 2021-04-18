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

export namespace AppStore {
  export const store = configureStore();
}

const App: React.FC<AppProps> = props => {
  return (
    <Provider store={AppStore.store}>
      <StyledApp className={"app"}>
        <NavigationContainer/>
      </StyledApp>
    </Provider>
  );
};

export default App;
