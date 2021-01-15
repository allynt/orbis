import React from 'react';
import { action } from '@storybook/addon-actions';
import { CheckboxFilters } from './checkbox-filters.component';

import { CATEGORIES } from '../../slices/mysupplylynk.constants';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

export default { title: 'Orbs/MySupplyLynk/Checkbox Filters' };

export const Default = () => (
  <Provider store={mockStore()}>
    <CheckboxFilters />
  </Provider>
);
