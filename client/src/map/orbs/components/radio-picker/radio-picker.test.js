import React from 'react';

import { getByLabelText, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';
import { sortPairs, getRange } from './radio-picker-helpers';

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

const noPairsLayer = {
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

it('uses `name` for label if no number range match returned from regex', () => {
  const { getByLabelText } = renderComponent(noPairsLayer, {});

  noPairsLayer.metadata.properties.forEach(p => {
    expect(getByLabelText(p.name)).toBeInTheDocument();
  });
});

describe('<RadioPicker />', () => {
  it('displays a radio for each selectable property in the source', () => {
    const { getByLabelText } = renderComponent();
    defaultSelectedLayer.metadata.properties.forEach(property => {
      const label = getRange(property);
      expect(getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('shows only Radio (no toggles) for each property, if there are no percentage/number pairs', () => {
    const { queryByText, getAllByRole } = renderComponent(noPairsLayer, {});

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

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('tooltip')).toHaveLength(
      sortPairs(defaultSelectedLayer).length,
    );
  });
});
