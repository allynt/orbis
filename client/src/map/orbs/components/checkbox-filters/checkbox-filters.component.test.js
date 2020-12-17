import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { CATEGORIES } from '../../slices/mysupplylynk.constants';

import { CheckboxFilters } from './checkbox-filters.component';

const wrapper = ({ children }) => (
  <Provider
    store={configureMockStore()({
      orbs: {
        mySupplyLynk: {
          categoryFilters: {
            'test-layer-1': CATEGORIES,
            'test-layer-2': CATEGORIES,
            'test-layer-3': CATEGORIES,
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
      <CheckboxFilters selectedLayer={{ source_id: 'test-layer-1' }} />,
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
