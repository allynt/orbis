import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import useUserRoleAuthorization from 'hooks/useUserRoleAuthorization';
import store from 'store';

import FiltersTool from './features/filters.component';
import StoriesTool from './features/stories.component';
import styles from './tools.module.css';

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
    const isAuthorized = useUserRoleAuthorization(['AstrosatRole']);

    return isAuthorized ? (
      <div className={styles.devTools}>
        <div>🛠 Dev Tools</div>
        <div className={styles.tools}>
          <LocalDevTools />
          <StoriesTool />
        </div>
      </div>
    ) : null;
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
