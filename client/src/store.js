import thunk from 'redux-thunk';

import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';

import rootReducer, { history } from './root.reducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, routerMiddleware(history)],
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root.reducer', () => {
    const newRootReducer = require('./root.reducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
export const persistor = persistStore(store);
