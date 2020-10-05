import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { CATEGORIES } from '../../mySupplyLynk/mysupplylynk.constants';

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

  it.skip('calls `setSelectedFeatures` function with updated categories when checkboxes are checked/unchecked', () => {
    const filteredCategories = CATEGORIES.filter(cat => cat !== 'PPE');

    const { getByText } = render(<CheckboxFilters />, {
      wrapper,
    });

    userEvent.click(getByText('PPE'));

    // expect(setSelectedFeatures).toHaveBeenCalledWith(filteredCategories);
  });

  it.skip('only checks checkboxes where of categories that are present in `selectedCategories`', () => {
    const testCategories = ['PPE', 'Other'];

    const { getByLabelText } = render(<CheckboxFilters />, {
      wrapper,
    });

    testCategories.forEach(cat => {
      expect(getByLabelText(cat)).toHaveAttribute('checked');
    });

    CATEGORIES.forEach(cat => {
      if (!testCategories.includes(cat)) {
        expect(getByLabelText(cat)).not.toHaveAttribute('checked');
      }
    });
  });
});
