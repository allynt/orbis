import { combineReducers } from 'redux';
import rice from './rice/rice.slice';
import isolationPlus from './isolationPlus/isolation-plus.slice';
import mySupplyLynk from './mySupplyLynk/mysupplylynk.slice';

const orbReducer = combineReducers({
  rice,
  isolationPlus,
  mySupplyLynk,
});

export default orbReducer;
