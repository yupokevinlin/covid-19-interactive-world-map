import rootReducer from "./rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";

export type Store = ReturnType<typeof rootReducer>;

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25,
  });
  const store = createStore(rootReducer, composeEnhancers(middlewareEnhancer));
  return {
    ...store,
    runSaga: sagaMiddleware.run(rootSaga),
  };
};
