import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { RadioPicker } from './radio-picker.component';
import { groupProperties } from './helpers/group-properties.js';

const mockStore = configureStore();

let dispatch = null;

const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [
      {
        name: 'Census 2011: % of people in the age band 40 - 64',
        label: 'People in the age band 40 - 64',
        type: 'percentage',
        property_group: '1',
      },
      {
        name: 'Census 2011: number of people in the age band 40 - 64',
        label: 'People in the age band 40 - 64',
        type: 'continuous',
        property_group: '1',
      },
      {
        name: 'Census 2011: % of people in the age band 65+',
        label: 'People in the age band 65+',
        type: 'percentage',
        property_group: '2',
      },
      {
        name: 'Census 2011: number of people in the age band 65+',
        label: 'People in the age band 65+',
        type: 'continuous',
        property_group: '2',
      },
    ],
  },
};

const renderComponent = (
  selectedLayer = defaultSelectedLayer,
  initialState = {
    property: {
      source_id: undefined,
      name: undefined,
    },
    pickedInfo: undefined,
    filterData: {
      filterRange: [undefined, undefined],
      clipPosition: {},
    },
  },
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
    const { getByRole } = renderComponent();
    groupProperties(defaultSelectedLayer.metadata.properties).forEach(pair => {
      expect(getByRole('radio', { name: pair[0].label })).toBeInTheDocument();
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

    const { queryByRole } = renderComponent(noPairs, {
      property: {
        source_id: noPairs.source_id,
        name: 'Test Name 1',
      },
    });

    expect(
      queryByRole('button', { name: 'Percentage' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Number' })).not.toBeInTheDocument();
  });

  it('selects percentage property by default when Radio is checked', () => {
    const { getByRole } = renderComponent();

    userEvent.click(
      getByRole('radio', {
        name: 'People in the age band 40 - 64',
      }),
    );

    const expected = {
      type: 'isolationPlus/setProperty',
      payload: {
        source_id: defaultSelectedLayer.source_id,
        name: 'Census 2011: % of people in the age band 40 - 64',
        label: 'People in the age band 40 - 64',
        type: 'percentage',
        property_group: '1',
      },
    };

    expect(dispatch).toHaveBeenCalledWith(expected);
  });

  it('has an info icon for each radio', () => {
    const { getAllByRole } = renderComponent();
    expect(getAllByRole('tooltip')).toHaveLength(
      groupProperties(defaultSelectedLayer.metadata.properties).length,
    );
  });
});
