import { combineReducers } from "redux";
import { reducer as mapPageContainerReducer } from "./containers/MapPageContainer/reducer";
import { reducer as pageWrapperContainerReducer } from "./containers/PageWrapperContainer/reducer";

export const rootReducer = combineReducers({
  map: mapPageContainerReducer,
  page: pageWrapperContainerReducer
});

export default rootReducer;
