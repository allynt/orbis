import React from 'react';
import ReactDOM from 'react-dom';

import StoriesTool from './features/stories.component';
import FiltersTool from './features/filters.component';
import SatellitesTool from './features/satellites.component';
import AdminTool from './features/admin.component';

import styles from './tools.module.css';

const isProduction = process.env.NODE_ENV === 'production';

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
    return (
      <div className={styles.devTools}>
        <div>🛠 Dev Tools</div>
        <div className={styles.tools}>
          {!isProduction && <LocalDevTools />}
          {!isProduction && <StoriesTool />}
          {!isProduction && <FiltersTool />}
          {!isProduction && <SatellitesTool />}
          {!isProduction && <AdminTool />}
        </div>
      </div>
    );
  };

  // Add dev tools UI to the page.
  const devToolsRoot = document.createElement('div');
  document.body.appendChild(devToolsRoot);
  ReactDOM.render(<DevTools />, devToolsRoot);
};

export { install };
