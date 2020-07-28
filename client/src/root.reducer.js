import { combineReducers } from 'redux';

import { createBrowserHistory } from 'history';

import { connectRouter } from 'connected-react-router';

import app from './app.slice';
import map from './map/map.slice';
import data from './data-layers/data-layers.slice';
import satellites from './satellites/satellites.slice';
import accounts from './accounts/accounts.slice';
import theming from './theming/theming.slice';
import admin from './admin/admin.slice';
import bookmarks from './bookmarks/bookmark.slice';
import sideMenu from './side-menu/side-menu.slice';
import stories from './stories/stories.slice';
import orbs from './map/orbs/orbReducer';

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    map,
    sideMenu,
    data,
    satellites,
    app,
    accounts,
    theming,
    admin,
    bookmarks,
    stories,
    router: connectRouter(history),
    orbs,
  });

const rootReducer = createRootReducer(history);

export default rootReducer;
