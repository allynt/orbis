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
          categoryFilters: CATEGORIES,
        },
      },
    })}
    children={children}
  />
);

describe('Checkbox Filters', () => {
  it('renders pre-checked checkboxes for all of the category types', () => {
    const { getByText, getByLabelText } = render(<CheckboxFilters />, {
      wrapper,
    });

    CATEGORIES.forEach(cat => {
      expect(getByText(cat)).toBeInTheDocument();
      expect(getByLabelText(cat)).toHaveAttribute('checked');
    });
  });
});
