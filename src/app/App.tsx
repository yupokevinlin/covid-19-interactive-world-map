import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../state/store";
import styled from "styled-components";

export interface AppProps {}

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
`;

const App: React.FC<AppProps> = props => {
  return (
    <Provider store={configureStore()}>
      <StyledApp className={"app"} />
    </Provider>
  );
};

export default App;
