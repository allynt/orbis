import { combineReducers } from 'redux';
import rice from './rice/rice.slice';

const orbReducer = combineReducers({
  rice,
});

export default orbReducer;
