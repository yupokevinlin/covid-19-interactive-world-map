import { combineReducers } from "redux";
import { reducer as appReducer } from "./global/App/reducer";
import { reducer as homePageReducer } from "./containers/HomePageContainer/reducer";
import { reducer as mapPageReducer } from "./containers/MapPageContainer/reducer";
import { reducer as chartPageReducer } from "./containers/ChartPageContainer/reducer";

export const rootReducer = combineReducers({
  app: appReducer,
  homePage: homePageReducer,
  mapPage: mapPageReducer,
  chartPage: chartPageReducer,
});

export default rootReducer;
