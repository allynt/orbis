import React from 'react';
import { RadioPicker } from './radio-picker.component';
import { Provider } from 'react-redux';
import store from 'store';

export default { title: 'Map/Radio Picker' };

export const NoOptions = () => (
  <Provider store={store}>
    <RadioPicker selectedLayer={{ source_id: 'test/layer' }} />
  </Provider>
);
