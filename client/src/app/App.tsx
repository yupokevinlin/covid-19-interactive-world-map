import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {Provider} from "react-redux";
import {configureStore} from "../state/store";
import {makeStyles} from "@material-ui/core/styles";
import NavigationContainer from "../display/containers/NavigationContainer/NavigationContainer";

export type AppProps = AppDataProps & AppStyleProps & AppEventProps;

export interface AppDataProps {

}

export interface AppStyleProps {

}

export interface AppEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
    },
  }),
);

export namespace AppStore {
  export const store = configureStore();
}

const App: React.FC<AppProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <Provider store={AppStore.store}>
      <div className={classes.app}>
        <NavigationContainer/>
      </div>
    </Provider>
  );
};

export default App;

