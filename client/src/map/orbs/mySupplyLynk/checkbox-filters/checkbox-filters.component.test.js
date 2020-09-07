import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CATEGORIES } from '../mysupplylynk.constants';

import { CheckboxFilters } from './checkbox-filters.component';

describe('Checkbox Filters', () => {
  let selectedFeatures = CATEGORIES;
  let setSelectedFeatures = jest.fn();

  it('renders pre-checked checkboxes for all of the category types', () => {
    const { getByText, getByTestId } = render(
      <CheckboxFilters
        categories={CATEGORIES}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
      />,
    );

    CATEGORIES.forEach(cat => {
      expect(getByText(cat)).toBeInTheDocument();
      expect(getByTestId(`${cat}-checkbox`).checked).toEqual(true);
    });
  });

  it('calls `setSelectedFeatures` function with updated categories when checkboxes are checked/unchecked', () => {
    const filteredCategories = CATEGORIES.filter(cat => cat !== 'PPE');

    const { getByText } = render(
      <CheckboxFilters
        categories={CATEGORIES}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
      />,
    );

    userEvent.click(getByText('PPE'));

    expect(setSelectedFeatures).toHaveBeenCalledWith(filteredCategories);
  });

  it('only checks checkboxes where of categories that are present in `selectedCategories`', () => {
    const testCategories = ['PPE', 'Miscellaneous'];

    const { getByTestId } = render(
      <CheckboxFilters
        categories={CATEGORIES}
        selectedFeatures={testCategories}
        setSelectedFeatures={setSelectedFeatures}
      />,
    );

    testCategories.forEach(cat => {
      expect(getByTestId(`${cat}-checkbox`).checked).toEqual(true);
    });

    CATEGORIES.forEach(cat => {
      if (!testCategories.includes(cat)) {
        expect(getByTestId(`${cat}-checkbox`).checked).toEqual(false);
      }
    });
  });
});
