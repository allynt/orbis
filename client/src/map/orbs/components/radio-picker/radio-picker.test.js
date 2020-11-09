import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';
import { sortPairs, getRange } from './radio-picker-helpers';

const mockStore = configureStore();
const dispatch = jest.fn();

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
) =>
  render(<RadioPicker selectedLayer={selectedLayer} dispatch={dispatch} />, {
    wrapper: ({ children }) => (
      <Provider store={mockStore(initialState)}>{children}</Provider>
    ),
  });

describe('<RadioPicker />', () => {
  const firstPropertyLabel = getRange(
    defaultSelectedLayer.metadata.properties[0],
  );

  it('displays a radio for each selectable property in the source', () => {
    const { getByLabelText } = renderComponent();
    defaultSelectedLayer.metadata.properties.forEach(property => {
      const label = getRange(property);
      expect(getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('reveals number/percentage toggle buttons when Radio is checked', () => {
    const { getByText, getByLabelText } = renderComponent();

    userEvent.click(getByLabelText(firstPropertyLabel));

    expect(getByLabelText(firstPropertyLabel)).toHaveProperty('checked', true);

    expect(getByText('Percentage')).toBeInTheDocument();
    expect(getByText('Number')).toBeInTheDocument();
  });

  it('selects percentage property by default when Radio is checked', () => {
    const { getByLabelText } = renderComponent();

    userEvent.click(getByLabelText(firstPropertyLabel));

    const expected = {
      source_id: defaultSelectedLayer.source_id,
      name: 'Census 2011: % of people in the age band 40 - 64',
      type: 'percentage',
    };

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('dispatches selected property when toggle buttons are clicked', () => {
    const { getByText, getByLabelText } = renderComponent();

    userEvent.click(getByLabelText(firstPropertyLabel));
    userEvent.click(getByText('Number'));

    const expected = {
      source_id: defaultSelectedLayer.source_id,
      name: 'Census 2011: number of people in the age band 40 - 64',
      type: 'continuous',
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
