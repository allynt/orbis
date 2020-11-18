import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';
import { getProperties } from './helpers/get-properties.js';

const mockStore = configureStore();

let dispatch = null;

const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [
      {
        name: 'Census 2011: % of people in the age band 40 - 64',
        type: 'percentage',
        property_group: '1',
      },
      {
        name: 'Census 2011: number of people in the age band 40 - 64',
        type: 'continuous',
        property_group: '1',
      },
      {
        name: 'Census 2011: % of people in the age band 65+',
        type: 'percentage',
        property_group: '2',
      },
      {
        name: 'Census 2011: number of people in the age band 65+',
        type: 'continuous',
        property_group: '2',
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
    getProperties(defaultSelectedLayer).forEach(pair => {
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
            property_group: '1',
          },
          {
            name: 'Test Name 2',
            property_group: '2',
          },
        ],
      },
    };

    const { queryByText } = renderComponent(noPairs, {
      property: {
        source_id: noPairs.source_id,
        name: 'Test Name 1',
      },
    });

    expect(queryByText('Percentage')).not.toBeInTheDocument();
    expect(queryByText('Number')).not.toBeInTheDocument();
  });

  it('reveals number/percentage toggle buttons when Radio is checked', () => {
    const { getByText, getAllByRole } = renderComponent(defaultSelectedLayer, {
      isolationPlus: {
        property: {
          source_id: defaultSelectedLayer.source_id,
          name: 'Census 2011: % of people in the age band 40 - 64',
        },
      },
    });

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
        property_group: '1',
      },
    };

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('dispatches selected property when toggle buttons are clicked', () => {
    const { getByText } = renderComponent(defaultSelectedLayer, {
      isolationPlus: {
        property: {
          source_id: defaultSelectedLayer.source_id,
          name: 'Census 2011: % of people in the age band 40 - 64',
        },
      },
    });

    userEvent.click(getByText('Number'));

    const expected = {
      type: 'isolationPlus/setProperty',
      payload: {
        source_id: defaultSelectedLayer.source_id,
        name: 'Census 2011: number of people in the age band 40 - 64',
        type: 'continuous',
      },
    };

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('tooltip')).toHaveLength(
      getProperties(defaultSelectedLayer).length,
    );
  });
});
