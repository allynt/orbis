import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';

import useAuthorization from 'hooks/useAuthorization';
import store from 'store';
import StoriesTool from './features/stories.component';
import FiltersTool from './features/filters.component';
import SatellitesTool from './features/satellites.component';

import styles from './tools.module.css';
import { userSelector } from 'accounts/accounts.slice';

const install = () => {
  window.devToolsEnabled = true;

  // load local dev tools if it's there
  // NOTE: this is using some webpack-sepecific features.
  // if you're not using webpack, you might consider using
  // https://npm.im/preval.macro or https://npm.im/codegen.macro
  const requireDevToolsLocal = require.context('./', false, /tools\.local\.js/);
  const local = requireDevToolsLocal.keys()[0];
  let LocalDevTools;
  if (local) {
    LocalDevTools = requireDevToolsLocal(local).default;
  }
  LocalDevTools = LocalDevTools || (() => null);

  const DevTools = () => {
    const user = useSelector(userSelector);
    const isAuthorized = useAuthorization(user, ['AstrosatRole']);

    return (
      isAuthorized && (
        <div className={styles.devTools}>
          <div>🛠 Dev Tools</div>
          <div className={styles.tools}>
            <LocalDevTools />
            <StoriesTool />
            <SatellitesTool />
          </div>
        </div>
      )
    );
  };

  // Add dev tools UI to the page.
  const devToolsRoot = document.createElement('div');
  document.body.appendChild(devToolsRoot);
  ReactDOM.render(
    <Provider store={store}>
      <DevTools />
    </Provider>,
    devToolsRoot,
  );
};

export { install };
