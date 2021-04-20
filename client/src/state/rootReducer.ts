import { combineReducers } from "redux";
import { reducer as appReducer } from "./global/App/reducer";
import { reducer as mapPageReducer } from "./containers/MapPageContainer/reducer";
import { reducer as chartPageReducer } from "./containers/ChartPageContainer/reducer";

export const rootReducer = combineReducers({
  app: appReducer,
  mapPage: mapPageReducer,
  chartPage: chartPageReducer,
});

export default rootReducer;
