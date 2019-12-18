import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ReactGA from 'react-ga';
// import ReactTooltip from 'react-tooltip';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

// import registerServiceWorker from './registerServiceWorker';

import App from './app.component';
import store, { history, persistor } from './store';

import './polyfills/flat-map';
import './polyfills/object-fromEntries';

import './normalize.css';
import './reset.css';
import './typography.css';
import './index.css';

window.onerror = (msg, url, line, col, error) => {
  // Note that col & error are new to the HTML 5 spec and may not be
  // supported in every browser.  It worked for me in Chrome.
  let extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  const errorMsg = 'Error: ' + msg + '\nurl: ' + url + '\nline: ' + line + extra;

  // Report this error
  ReactGA.ga('send', 'exception', {
    exDescription: errorMsg,
    exFatal: false
  });

  const suppressErrorAlert = true;
  // If you return true, then error alerts (like in older versions of
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <NotificationContainer />
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
