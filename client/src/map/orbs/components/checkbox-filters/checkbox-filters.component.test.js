import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { CATEGORIES, LAYERS } from '../../slices/mysupplylynk.constants';

import { CheckboxFilters } from './checkbox-filters.component';

const wrapper = ({ children }) => (
  <Provider
    store={configureMockStore()({
      orbs: {
        mySupplyLynk: {
          categoryFilters: {
            [LAYERS.suppliers]: CATEGORIES,
            [LAYERS.nonRegistered]: CATEGORIES,
            [LAYERS.cqc]: CATEGORIES,
          },
        },
      },
    })}
    children={children}
  />
);

describe('Checkbox Filters', () => {
  it('renders pre-checked checkboxes for all of the category types', () => {
    const { getByText, getByLabelText } = render(
      <CheckboxFilters selectedLayer={{ source_id: LAYERS.suppliers }} />,
      {
        wrapper,
      },
    );

    CATEGORIES.forEach(cat => {
      expect(getByText(cat)).toBeInTheDocument();
      expect(getByLabelText(cat)).toHaveAttribute('checked');
    });
  });
});
