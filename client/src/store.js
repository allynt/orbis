import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';

import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';

import ReduxQuerySync from 'redux-query-sync';

import rootReducer, { history } from './root.reducer';

// 1. Setup store to use middleware (thunk) to create API calls.
// 2. Add redux-logger to middleware.
const middleware = [thunk, routerMiddleware(history)];

let store;

if (process.env.NODE_ENV === 'development') {
  // 1. Add redux dev tools (development mode only).
  // 2. Create store composed of reducers and middleware.
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(rootReducer, composeEnhancer(applyMiddleware(...middleware)));
} else {
  // 1. Create store composed of reducers and middleware.
  store = createStore(rootReducer, applyMiddleware(...middleware));
}

ReduxQuerySync({
  store,
  params: {
    viewport: {
      selector: state => state.map.viewport,
      action: value => ({ type: 'SET_VIEWPORT', viewport: value }),
      stringToValue: string => JSON.parse(string),
      valueToString: value => JSON.stringify(value)
    }
  },
  initialTruth: 'location'
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
}
export default store;
export const persistor = persistStore(store);
