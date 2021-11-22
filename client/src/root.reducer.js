import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';

import drawingTools from 'drawing-tools/drawing-tools.slice';

import accounts from './accounts/accounts.slice';
import app from './app.slice';
import bookmarks from './bookmarks/bookmarks.slice';
import dashboard from './dashboard/dashboard.slice';
import data from './data-layers/data-layers.slice';
import map from './map/map.slice';
import orbs from './map/orbs/orbReducer';
import missionControl from './mission-control/mission-control.slice';
import satellites from './satellites/satellites.slice';
import stories from './stories/stories.slice';

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    accounts,
    app,
    bookmarks,
    data,
    drawingTools,
    map,
    orbs,
    router: connectRouter(history),
    satellites,
    stories,
    missionControl,
    dashboard,
  });

const rootReducer = createRootReducer(history);

/** @typedef {ReturnType<rootReducer>} RootState */

export default rootReducer;
