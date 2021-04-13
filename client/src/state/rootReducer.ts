import { combineReducers } from "redux";
import { reducer as appReducer } from "./global/App/reducer";

export const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;
