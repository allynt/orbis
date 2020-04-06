import { combineReducers } from 'redux';

import { createBrowserHistory } from 'history';

import { connectRouter } from 'connected-react-router';

import app from './app.slice';
import map from './map/map.reducer';
import dataLayers from './data-layers/data-layers.slice';
import satellites from './satellites/satellites.slice';
import accounts from './accounts/accounts.reducer';
import theming from './theming/theming.slice';
import admin from './accounts/admin/users.reducer';
import bookmarks from './bookmarks/bookmark.slice';
import sidebar from './side-menu/side-menu.slice';

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
    bookmarks,
    router: connectRouter(history)
  });

const rootReducer = createRootReducer(history);

export default rootReducer;
