import { combineReducers } from 'redux';
import crowdless from './slices/crowdless.slice';
import layers from './layers.slice';

/**
 * @typedef {ReturnType<orbReducer>} OrbState
 */

const orbReducer = combineReducers({
  layers,
  crowdless,
});

export default orbReducer;
