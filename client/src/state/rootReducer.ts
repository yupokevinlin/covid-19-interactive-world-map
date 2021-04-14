import { combineReducers } from "redux";
import { reducer as appReducer } from "./global/App/reducer";
import { reducer as mapPageReducer } from "./containers/MapPageContainer/reducer";

export const rootReducer = combineReducers({
  app: appReducer,
  mapPage: mapPageReducer,
});

export default rootReducer;
