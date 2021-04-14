import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';

import accounts from './accounts/accounts.slice';
import admin from './admin/admin.slice';
import app from './app.slice';
import bookmarks from './bookmarks/bookmarks.slice';
import controlPanel from './control-panel/control-panel.slice';
import data from './data-layers/data-layers.slice';
import drawingTools from 'drawing-tools/drawing-tools.slice';
import map from './map/map.slice';
import orbs from './map/orbs/orbReducer';
import satellites from './satellites/satellites.slice';
import stories from './stories/stories.slice';
import theming from './theming/theming.slice';

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    accounts,
    admin,
    app,
    bookmarks,
    controlPanel,
    data,
    drawingTools,
    map,
    orbs,
    router: connectRouter(history),
    satellites,
    stories,
    theming,
  });

const rootReducer = createRootReducer(history);

export default rootReducer;
