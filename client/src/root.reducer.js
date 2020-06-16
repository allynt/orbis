import { combineReducers } from 'redux';

import { createBrowserHistory } from 'history';

import { connectRouter } from 'connected-react-router';

import app from './app.slice';
import map from './map/map.slice';
import data from './data-layers/data-layers.slice';
import satellites from './satellites/satellites.slice';
import accounts from './accounts/accounts.slice';
import theming from './theming/theming.slice';
import admin from './admin/users.slice';
import bookmarks from './bookmarks/bookmark.slice';
import sidebar from './side-menu/side-menu.slice';
import stories from './stories/stories.slice';

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    map,
    sidebar,
    data,
    satellites,
    app,
    accounts,
    theming,
    admin,
    bookmarks,
    stories,
    router: connectRouter(history),
  });

const rootReducer = createRootReducer(history);

export default rootReducer;
