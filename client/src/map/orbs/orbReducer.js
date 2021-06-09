import { combineReducers } from 'redux';

import layers from './layers.slice';
import crowdless from './slices/crowdless.slice';

/**
 * @typedef {ReturnType<orbReducer>} OrbState
 */

const orbReducer = combineReducers({
  layers,
  crowdless,
});

export default orbReducer;
