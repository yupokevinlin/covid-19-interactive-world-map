import { combineReducers } from "redux";
import { reducer as mapPageContainerReducer } from "./containers/MapPageContainer/reducer";

export const rootReducer = combineReducers({
  map: mapPageContainerReducer,
});

export default rootReducer;
