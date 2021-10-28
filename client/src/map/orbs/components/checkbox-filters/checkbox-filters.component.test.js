// @ts-nocheck
import React from 'react';

import { setFilterValue } from 'map/orbs/layers.slice';
import { render, screen, userEvent } from 'test/test-utils';

import { CheckboxFilters } from './checkbox-filters.component';

const FILTERS = [
  {
    value: 'Picnic site',
    label: 'Picnic site',
    icon: 'PicnicSite',
  },
  {
    value: 'Place of Worship',
    label: 'Place of Worship',
    icon: 'PlaceOfWorship',
  },
  {
    value: 'Food bank',
    label: 'Food Bank',
    icon: 'FoodBank',
  },
];

describe('<CheckboxFilters />', () => {
  it('Shows checkboxes for each value in the filters prop', () => {
    render(<CheckboxFilters filters={FILTERS} />);

    FILTERS.forEach(({ label }) =>
      expect(screen.getByRole('checkbox', { name: label })).toBeInTheDocument(),
    );
  });

  it('Uses value if label is undefined', () => {
    render(
      <CheckboxFilters filters={FILTERS.map(({ label, ...rest }) => rest)} />,
    );

    FILTERS.forEach(({ value }) =>
      expect(screen.getByRole('checkbox', { name: value })).toBeInTheDocument(),
    );
  });

  it('Shows all checkboxes as checked if the state is undefined', () => {
    render(<CheckboxFilters filters={FILTERS} />);

    FILTERS.forEach(({ label }) =>
      expect(screen.getByRole('checkbox', { name: label })).toBeChecked(),
    );
  });

  it('Shows a checkbox unchecked if that value is filtered', () => {
    render(
      <CheckboxFilters
        filters={FILTERS}
        filterValue={[FILTERS[1].value, FILTERS[2].value]}
      />,
    );

    expect(
      screen.getByRole('checkbox', { name: FILTERS[1].label }),
    ).not.toBeChecked();
  });

  it(`Dispatches ${setFilterValue.type} with the unchecked value when filterValue is undefined in state`, () => {
    const onChange = jest.fn();
    render(<CheckboxFilters filters={FILTERS} onChange={onChange} />);

    userEvent.click(screen.getByRole('checkbox', { name: FILTERS[0].label }));
    expect(onChange).toHaveBeenCalledWith(
      [FILTERS[0].value],
      FILTERS[0].value,
      true,
    );
  });

  it(`Dispatches ${setFilterValue.type} action with all the checked checkboxes when one is checked`, () => {
    const onChange = jest.fn();
    render(
      <CheckboxFilters
        filters={FILTERS}
        filterValue={[FILTERS[1].value, FILTERS[2].value]}
        onChange={onChange}
      />,
    );

    userEvent.click(screen.getByRole('checkbox', { name: FILTERS[0].label }));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining(FILTERS.map(f => f.value)),
      FILTERS[0].value,
      true,
    );
  });
});
