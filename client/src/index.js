import React, { StrictMode } from 'react';

import { CssBaseline, ThemeProvider } from '@astrosat/astrosat-ui';

import { ConnectedRouter } from 'connected-react-router';
import ReactDOM from 'react-dom';
import { NotificationContainer } from 'react-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-notifications/lib/notifications.css';

import { MapProvider } from 'MapContext';

import installDevTools from './dev-tools/load';
import { history } from './root.reducer';
import store, { persistor } from './store';

import './polyfills/flat-map';
import './polyfills/object-fromEntries';

const render = () => {
  const App = require('./app.component').default;

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <NotificationContainer />
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <StrictMode>
            <MapProvider>
              <ThemeProvider>
                <CssBaseline />
                <App />
              </ThemeProvider>
            </MapProvider>
          </StrictMode>
        </PersistGate>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

installDevTools(() => {
  render();
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app.component', render);
}

if (window.Cypress) {
  window.store = store;
}
