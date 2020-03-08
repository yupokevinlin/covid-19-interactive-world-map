import rootReducer from "./rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore } from "redux";

export type Store = ReturnType<typeof rootReducer>;

export const configureStore = () => {
  const middlewares = [];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25,
  });
  const store = createStore(rootReducer, composeEnhancers(middlewareEnhancer));
  return store;
};
