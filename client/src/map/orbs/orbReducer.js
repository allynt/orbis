import { combineReducers } from 'redux';

import layers from './layers.slice';
import aisShipping from './slices/ais-shipping.slice';
import crowdless from './slices/crowdless.slice';

/**
 * @typedef {ReturnType<orbReducer>} OrbState
 */

const orbReducer = combineReducers({
  layers,
  crowdless,
  aisShipping,
});

export default orbReducer;
