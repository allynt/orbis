// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { CheckboxFilters } from './checkbox-filters.component';
import { setFilterValue } from 'map/orbs/orbReducer';
import userEvent from '@testing-library/user-event';

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

const mockStore = configureMockStore();

const renderComponent = ({ filters = FILTERS, state = {} } = {}) => {
  const dispatch = jest.fn();
  const utils = render(
    <Provider
      store={mockStore({
        orbs: {
          layers: {
            [LAYER.source_id]: state,
          },
        },
      })}
    >
      <CheckboxFilters
        selectedLayer={LAYER}
        dispatch={dispatch}
        filters={filters}
      />
    </Provider>,
  );
  return { dispatch, ...utils };
};

describe('<CheckboxFilters />', () => {
  it('Shows checkboxes for each value in the filters prop', () => {
    const { getByRole } = renderComponent();
    FILTERS.forEach(({ label }) =>
      expect(getByRole('checkbox', { name: label })).toBeInTheDocument(),
    );
  });

  it('Uses value if label is undefined', () => {
    const { getByRole } = renderComponent({
      filters: FILTERS.map(({ label, ...rest }) => rest),
    });
    FILTERS.forEach(({ value }) =>
      expect(getByRole('checkbox', { name: value })).toBeInTheDocument(),
    );
  });

  it('Shows all checkboxes as checked if the state is undefined', () => {
    const { getByRole } = renderComponent();
    FILTERS.forEach(({ label }) =>
      expect(getByRole('checkbox', { name: label })).toBeChecked(),
    );
  });

  it('Shows a checkbox unchecked if that value is filtered', () => {
    const { getByRole } = renderComponent({
      state: { filterValue: [FILTERS[1].value, FILTERS[2].value] },
    });
    expect(getByRole('checkbox', { name: FILTERS[1].label })).not.toBeChecked();
  });

  it(`Dispatches ${setFilterValue.type} with the unchecked value when filterValue is undefined in state`, () => {
    const { getByRole, dispatch } = renderComponent();
    userEvent.click(getByRole('checkbox', { name: FILTERS[0].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: [FILTERS[0].value],
      }),
    );
  });

  it(`Dispatches ${setFilterValue.type} action with all the checked checkboxes when one is checked`, () => {
    const { getByRole, dispatch } = renderComponent({
      state: { filterValue: [FILTERS[1].value, FILTERS[2].value] },
    });
    userEvent.click(getByRole('checkbox', { name: FILTERS[0].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: expect.arrayContaining(FILTERS.map(f => f.value)),
      }),
    );
  });

  it(`Dispatches ${setFilterValue.type} action with checked checkboxes when some are removed from state`, () => {
    const { getByRole, dispatch } = renderComponent({
      state: { filterValue: FILTERS.map(f => f.value) },
    });
    userEvent.click(getByRole('checkbox', { name: FILTERS[1].label }));
    expect(dispatch).toHaveBeenCalledWith(
      setFilterValue({
        key: LAYER.source_id,
        filterValue: [FILTERS[0].value, FILTERS[2].value],
      }),
    );
  });
});
