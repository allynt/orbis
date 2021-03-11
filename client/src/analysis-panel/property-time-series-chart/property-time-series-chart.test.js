// @ts-nocheck
import { render } from '@testing-library/react';
import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { PropertyTimeSeriesChart } from './property-time-series-chart.component';

const mockStore = configureMockStore();

const renderComponent = clickedFeatures => {
  const state = {
    property: { label: 'Hello', name: 'test' },
    clickedFeatures,
  };

  const store = mockStore({
    orbs: {
      isolationPlus: state,
    },
  });

  const utils = render(
    <Provider store={store}>
      <PropertyTimeSeriesChart
        selectedProperty={state.property}
        clickedFeatures={clickedFeatures}
        timestampFormat={'yyyy'}
      />
    </Provider>,
  );

  return { ...utils };
};

describe('<PropertyTimeSeriesChart />', () => {
  it('Renders just the title if there are no clicked features', () => {
    const { getByText, queryByText } = renderComponent(undefined);

    expect(getByText('Time Series')).toBeInTheDocument();
    expect(queryByText('Hello')).not.toBeInTheDocument();
  });

  it('Formats dates depending on the timestampFormat prop', () => {
    const clickedFeatures = [
      {
        object: {
          properties: {
            test: [{ timestamp: '2077-10-23T00:00:00.000Z', value: 1 }],
          },
        },
      },
    ];

    const { getByText } = renderComponent(clickedFeatures);

    expect(getByText('2077')).toBeInTheDocument();
  });

  it("Uses aggregate values if there's more than one clicked feature", () => {
    const clickedFeatures = [
      {
        object: {
          properties: {
            test: [{ timestamp: '2077-10-23T00:00:00.000Z', value: 1 }],
          },
        },
      },
      {
        object: {
          properties: {
            test: [{ timestamp: '2077-10-23T00:00:00.000Z', value: 2 }],
          },
        },
      },
    ];

    const { getAllByText } = renderComponent(clickedFeatures);

    expect(getAllByText(/3/).length).toBeGreaterThanOrEqual(1);
  });
});
