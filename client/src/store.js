import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';
import { persistStore } from 'redux-persist';

import { createRootReducer } from './root.reducer';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

const store = configureStore({
  reducer: createRootReducer({ routerReducer }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(routerMiddleware),
});

export const history = createReduxHistory(store);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
export const persistor = persistStore(store);
