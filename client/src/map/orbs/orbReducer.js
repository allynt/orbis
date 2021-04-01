import { combineReducers } from 'redux';
import isolationPlus from './slices/isolation-plus.slice';
import crowdless from './slices/crowdless.slice';
import layers from './layers.slice';

/**
 * @typedef {ReturnType<orbReducer>} OrbState
 */

const orbReducer = combineReducers({
  layers,
  isolationPlus,
  crowdless,
});

export default orbReducer;
