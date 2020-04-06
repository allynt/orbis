import thunk from 'redux-thunk';

import { configureStore } from '@reduxjs/toolkit';

import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import ReduxQuerySync from 'redux-query-sync';

import rootReducer, { history } from './root.reducer';

import { setViewport } from './map/map.slice';

const persistConfig = {
  key: 'root',
  storage
};

const persistedRouter = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRouter,
  middleware: [thunk, routerMiddleware(history)]
});

ReduxQuerySync({
  store,
  params: {
    viewport: {
      selector: state => state.map.viewport,
      action: value => setViewport(value),
      stringToValue: string => JSON.parse(string),
      valueToString: value => JSON.stringify(value)
    }
  },
  initialTruth: 'location'
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    const newPersistedRouter = persistReducer(persistConfig, newRootReducer);
    store.replaceReducer(newPersistedRouter);
  });
}

export default store;
export const persistor = persistStore(store);
