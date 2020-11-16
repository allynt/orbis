import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';
import { sortPairs } from './helpers/sort-pairs.js';

const mockStore = configureStore();

let dispatch = null;

const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [
      {
        name: 'Census 2011: % of people in the age band 40 - 64',
        type: 'percentage',
      },
      {
        name: 'Census 2011: number of people in the age band 40 - 64',
        type: 'continuous',
      },
      {
        name: 'Census 2011: % of people in the age band 65+',
        type: 'percentage',
      },
      {
        name: 'Census 2011: number of people in the age band 65+',
        type: 'continuous',
      },
    ],
  },
};

const renderComponent = (
  selectedLayer = defaultSelectedLayer,
  initialState = {},
) => {
  dispatch = jest.fn();
  return render(
    <RadioPicker selectedLayer={selectedLayer} dispatch={dispatch} />,
    {
      wrapper: ({ children }) => (
        <Provider store={mockStore(initialState)}>{children}</Provider>
      ),
    },
  );
};

describe('<RadioPicker />', () => {
  it('displays a radio for each selectable property in the source', () => {
    const { getByLabelText } = renderComponent();
    sortPairs(defaultSelectedLayer).forEach(pair => {
      expect(getByLabelText(pair[0].name)).toBeInTheDocument();
    });
  });

  it('shows only Radio (no toggles) for each property, if there are no percentage/number pairs', () => {
    const noPairs = {
      source_id: 'test/layer',
      metadata: {
        properties: [
          {
            name: 'Test Name 1',
          },
          {
            name: 'Test Name 2',
          },
        ],
      },
    };

    const { queryByText, getAllByRole } = renderComponent(noPairs, {});

    userEvent.click(getAllByRole('radio')[0]);

    expect(queryByText('Percentage')).not.toBeInTheDocument();
    expect(queryByText('Number')).not.toBeInTheDocument();
  });

  it('reveals number/percentage toggle buttons when Radio is checked', () => {
    const { getByText, getAllByRole } = renderComponent();

    userEvent.click(getAllByRole('radio')[0]);

    expect(getAllByRole('radio')[0]).toHaveProperty('checked', true);

    expect(getByText('Percentage')).toBeInTheDocument();
    expect(getByText('Number')).toBeInTheDocument();
  });

  it('selects percentage property by default when Radio is checked', () => {
    const { getAllByRole } = renderComponent();

    userEvent.click(getAllByRole('radio')[0]);

    const expected = {
      type: 'isolationPlus/setProperty',
      payload: {
        source_id: defaultSelectedLayer.source_id,
        name: 'Census 2011: % of people in the age band 40 - 64',
        type: 'percentage',
      },
    };

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('dispatches selected property when toggle buttons are clicked', () => {
    const { getByText, getAllByRole } = renderComponent();

    userEvent.click(getAllByRole('radio')[0]);
    userEvent.click(getByText('Number'));

    const expected = {
      type: 'isolationPlus/setProperty',
      payload: {
        source_id: defaultSelectedLayer.source_id,
        name: 'Census 2011: number of people in the age band 40 - 64',
        type: 'continuous',
      },
    };

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('removes currently selected property from map when sidebar component dropdown is removed from DOM', () => {
    let isVisible = true;
    const { getByText } = render(
      <Provider store={mockStore({})}>
        {isVisible && (
          <RadioPicker
            selectedLayer={defaultSelectedLayer}
            dispatch={dispatch}
          />
        )}
        <button onClick={() => (isVisible = false)}>Show/Hide Radios</button>
      </Provider>,
    );

    const expected = {
      type: 'isolationPlus/setProperty',
      payload: {},
    };

    userEvent.click(getByText('Show/Hide Radios'));
    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('tooltip')).toHaveLength(
      sortPairs(defaultSelectedLayer).length,
    );
  });
});
