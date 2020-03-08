import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../state/store";

export interface AppProps {}

const App: React.FC<AppProps> = props => {
  return (
    <Provider store={configureStore()}>
      <div className={"app"} />
    </Provider>
  );
};

export default App;
