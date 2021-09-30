// @ts-nocheck
import React from 'react';

import { setFilterValue } from 'map/orbs/layers.slice';
import { render, screen, userEvent } from 'test/test-utils';

import { CheckboxFilters } from './checkbox-filters.component';

const LAYER = {
    source_id: 'test/layer/1',
  },
  FILTERS = [
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
    render(<CheckboxFilters selectedLayer={LAYER} filters={FILTERS} />);

    FILTERS.forEach(({ label }) =>
      expect(screen.getByRole('checkbox', { name: label })).toBeInTheDocument(),
    );
  });

  it('Uses value if label is undefined', () => {
    render(
      <CheckboxFilters
        selectedLayer={LAYER}
        filters={FILTERS.map(({ label, ...rest }) => rest)}
      />,
    );

    FILTERS.forEach(({ value }) =>
      expect(screen.getByRole('checkbox', { name: value })).toBeInTheDocument(),
    );
  });

  it('Shows all checkboxes as checked if the state is undefined', () => {
    render(<CheckboxFilters selectedLayer={LAYER} filters={FILTERS} />);

    FILTERS.forEach(({ label }) =>
      expect(screen.getByRole('checkbox', { name: label })).toBeChecked(),
    );
  });

  it('Shows a checkbox unchecked if that value is filtered', () => {
    const state = {
      orbs: {
        layers: {
          [LAYER.source_id]: {
            filterValue: [FILTERS[1].value, FILTERS[2].value],
          },
        },
      },
    };

    render(<CheckboxFilters selectedLayer={LAYER} filters={FILTERS} />, {
      state,
    });

    expect(
      screen.getByRole('checkbox', { name: FILTERS[1].label }),
    ).not.toBeChecked();
  });

  it(`Dispatches ${setFilterValue.type} with the unchecked value when filterValue is undefined in state`, () => {
    const dispatch = jest.fn();
    render(
      <CheckboxFilters
        selectedLayer={LAYER}
        filters={FILTERS}
        dispatch={dispatch}
      />,
    );

    userEvent.click(screen.getByRole('checkbox', { name: FILTERS[0].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: [FILTERS[0].value],
      }),
    );
  });

  it(`Dispatches ${setFilterValue.type} action with all the checked checkboxes when one is checked`, () => {
    const dispatch = jest.fn();
    const state = {
      orbs: {
        layers: {
          [LAYER.source_id]: {
            filterValue: [FILTERS[1].value, FILTERS[2].value],
          },
        },
      },
    };

    render(
      <CheckboxFilters
        selectedLayer={LAYER}
        filters={FILTERS}
        dispatch={dispatch}
      />,
      { state },
    );

    userEvent.click(screen.getByRole('checkbox', { name: FILTERS[0].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: expect.arrayContaining(FILTERS.map(f => f.value)),
      }),
    );
  });

  it(`Dispatches ${setFilterValue.type} action with checked checkboxes when some are removed from state`, () => {
    const dispatch = jest.fn();
    const state = {
      orbs: {
        layers: {
          [LAYER.source_id]: { filterValue: FILTERS.map(f => f.value) },
        },
      },
    };

    render(
      <CheckboxFilters
        selectedLayer={LAYER}
        filters={FILTERS}
        dispatch={dispatch}
      />,
      { state },
    );

    userEvent.click(screen.getByRole('checkbox', { name: FILTERS[1].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: [FILTERS[0].value, FILTERS[2].value],
      }),
    );
  });
});
