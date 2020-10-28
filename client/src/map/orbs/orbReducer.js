import { combineReducers } from 'redux';
import rice from './rice/rice.slice';
import isolationPlus from './slices/isolation-plus.slice';
import mySupplyLynk from './slices/mysupplylynk.slice';
import actionForHelp from './slices/action-for-help.slice';

const orbReducer = combineReducers({
  rice,
  isolationPlus,
  mySupplyLynk,
  actionForHelp,
});

export default orbReducer;
