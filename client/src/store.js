import thunk from 'redux-thunk';

import { configureStore } from '@reduxjs/toolkit';

import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';

import ReduxQuerySync from 'redux-query-sync';

import rootReducer, { history } from './root.reducer';

import { setViewport, viewportSelector } from './map/map.slice';

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, routerMiddleware(history)],
});

ReduxQuerySync({
  store,
  params: {
    viewport: {
      selector: viewportSelector,
      action: value => setViewport(value),
      stringToValue: string => JSON.parse(string),
      valueToString: value => JSON.stringify(value),
    },
  },
  initialTruth: 'location',
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
export const persistor = persistStore(store);
