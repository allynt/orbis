import { render } from '@testing-library/react';
import React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { PropertyBreakdownChart } from './property-breakdown-chart.component';

const mockStore = configureMockStore();

const renderComponent = ({ features, property = {} }) => {
  const clickedFeatures = features?.map(properties => ({
    object: { properties },
  }));

  const store = mockStore({
    orbs: {
      isolationPlus: {
        property,
        clickedFeatures,
      },
    },
  });

  const utils = render(
    <Provider store={store}>
      <PropertyBreakdownChart
        clickedFeatures={clickedFeatures}
        selectedProperty={property}
      />
    </Provider>,
  );
  return { ...utils };
};

describe('<PropertyBreakdownChart />', () => {
  it("Shows nothing if there's no clickedFeatures", () => {
    const { queryByText } = renderComponent({ features: undefined });
    expect(queryByText('Breakdown')).not.toBeInTheDocument();
  });

  it("Shows nothing if there's no data", () => {
    const { queryByText } = renderComponent({
      features: [
        {
          fruit: NaN,
        },
        {
          fruit: NaN,
        },
      ],
      property: {
        breakdown: ['fruit'],
      },
    });
    expect(queryByText('Breakdown')).not.toBeInTheDocument();
  });

  it('Shows a legend item for each value in the breakdown', () => {
    const { getByText } = renderComponent({
      features: [
        {
          fruit: 1,
          trees: 9,
        },
      ],
      property: {
        breakdown: ['fruit', 'trees'],
      },
    });

    expect(getByText('fruit')).toBeInTheDocument();
    expect(getByText('trees')).toBeInTheDocument();
  });

  it('Shows segment labels fixed to precision in the selected property', () => {
    const { getByText } = renderComponent({
      features: [
        {
          fruit: 4.91655,
        },
        {
          fruit: 9.32467238,
        },
      ],
      property: {
        breakdown: ['fruit'],
        precision: 4,
        aggregation: 'mean',
      },
    });
    expect(getByText('7.1206')).toBeInTheDocument();
  });

  it('Shows segment labels fixed to default precision if not specified in the property', () => {
    const { getByText } = renderComponent({
      features: [
        {
          fruit: 4.91655,
        },

        {
          fruit: 9.32467238,
        },
      ],
      property: {
        breakdown: ['fruit'],
        aggregation: 'mean',
      },
    });
    expect(getByText('7.12')).toBeInTheDocument();
  });

  it('Does not show values <= 0', () => {
    const { queryByText } = renderComponent({
      property: {
        breakdown: ['fruit', 'trees'],
      },
      features: [
        {
          fruit: 1,
          trees: -5,
        },
        {
          fruit: 20,
          trees: 0,
        },
      ],
    });
    expect(queryByText('trees')).not.toBeInTheDocument();
  });
});