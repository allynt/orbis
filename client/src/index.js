import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import { PersistGate } from 'redux-persist/integration/react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import store, { persistor } from './store';
import { history } from './root.reducer';

import './polyfills/flat-map';
import './polyfills/object-fromEntries';
import { CssBaseline, ThemeProvider } from '@astrosat/astrosat-ui';

import installDevTools from './dev-tools/load';
import { MapProvider } from 'MapContext';

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
