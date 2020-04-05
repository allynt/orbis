import { combineReducers } from 'redux';

import { createBrowserHistory } from 'history';

import { connectRouter } from 'connected-react-router';

import app from './app.slice';
import map from './map/map.reducer';
import dataLayers from './data-layers/data-layers-dialog.reducer';
import satellites from './satellites/satellites.reducer';
import accounts from './accounts/accounts.reducer';
import theming from './theming/theming.reducer';
import admin from './accounts/admin/users.reducer';
import annotations from './annotations/annotations.reducer';
import bookmarks from './bookmarks/bookmarks.reducer';
import sidebar from './side-menu/side-menu.reducer';

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    map,
    sidebar,
    dataLayers,
    satellites,
    app,
    accounts,
    theming,
    admin,
    annotations,
    bookmarks,
    router: connectRouter(history)
  });

const rootReducer = createRootReducer(history);

export default rootReducer;
