import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ReactGA from 'react-ga';
// import ReactTooltip from 'react-tooltip';

import { PersistGate } from 'redux-persist/integration/react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// import registerServiceWorker from './registerServiceWorker';

import store, { persistor } from './store';
import { history } from './root.reducer';

import './polyfills/flat-map';
import './polyfills/object-fromEntries';
import { CssBaseline, ThemeProvider } from '@astrosat/astrosat-ui';

import installDevTools from './dev-tools/load';
import { MapProvider } from 'MapContext';

import { setApiUrl } from './app.slice';

window.onerror = (msg, url, line, col, error) => {
  // Note that col & error are new to the HTML 5 spec and may not be
  // supported in every browser.  It worked for me in Chrome.
  let extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  const errorMsg =
    'Error: ' + msg + '\nurl: ' + url + '\nline: ' + line + extra;

  // Report this error
  ReactGA.ga('send', 'exception', {
    exDescription: errorMsg,
    exFatal: false,
  });

  const suppressErrorAlert = true;
  // If you return true, then error alerts (like in older versions of
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};

process.env.NODE_ENV === 'development'
  ? store.dispatch(setApiUrl(process.env.REACT_APP_API_HOST))
  : store.dispatch(setApiUrl(window._env_.REACT_APP_API_HOST));

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
// registerServiceWorker();
