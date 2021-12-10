import React, { StrictMode } from 'react';

import { CssBaseline, ThemeProvider } from '@astrosat/astrosat-ui';

import ReactDOM from 'react-dom';
import { NotificationContainer } from 'react-notifications';
import { Provider } from 'react-redux';
import { HistoryRouter } from 'redux-first-history/rr6';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-notifications/lib/notifications.css';

import { MapProvider } from 'MapContext';

import installDevTools from './dev-tools/load';
import store, { history, persistor } from './store';

import './polyfills/flat-map';
import './polyfills/object-fromEntries';

const render = () => {
  const App = require('./app.component').default;

  ReactDOM.render(
    <Provider store={store}>
      <HistoryRouter history={history}>
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
      </HistoryRouter>
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
