import { combineReducers } from 'redux';
import rice from './rice/rice.slice';
import isolationPlus from './isolationPlus/isolation-plus.slice';

const orbReducer = combineReducers({
  rice,
  isolationPlus,
});

export default orbReducer;
