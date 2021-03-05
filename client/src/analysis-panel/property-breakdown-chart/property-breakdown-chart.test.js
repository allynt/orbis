import { render } from '@testing-library/react';
import React from 'react';
import { PropertyBreakdownChart } from './property-breakdown-chart.component';

const renderComponent = ({ clickedFeatures, selectedProperty = {} }) =>
  render(
    <PropertyBreakdownChart
      clickedFeatures={clickedFeatures?.map(properties => ({
        object: { properties },
      }))}
      selectedProperty={selectedProperty}
    />,
  );

describe('<PropertyBreakdownChart />', () => {
  it("Shows nothing if there's no clickedFeatures", () => {
    const { queryByText } = renderComponent({ clickedFeatures: undefined });
    expect(queryByText('Breakdown')).not.toBeInTheDocument();
  });

  it("Shows nothing if there's no data", () => {
    const { queryByText } = renderComponent({
      clickedFeatures: [
        {
          fruit: NaN,
        },
        {
          fruit: NaN,
        },
      ],
      selectedProperty: {
        breakdown: ['fruit'],
      },
    });
    expect(queryByText('Breakdown')).not.toBeInTheDocument();
  });

  it('Shows a legend item for each value in the breakdown', () => {
    const { getByText } = renderComponent({
      clickedFeatures: [
        {
          fruit: 1,
          trees: 9,
        },
      ],
      selectedProperty: {
        breakdown: ['fruit', 'trees'],
      },
    });

    expect(getByText('fruit')).toBeInTheDocument();
    expect(getByText('trees')).toBeInTheDocument();
  });

  it('Shows segment labels fixed to precision in the selected property', () => {
    const { getByText } = renderComponent({
      clickedFeatures: [
        {
          fruit: 4.91655,
        },
        {
          fruit: 9.32467238,
        },
      ],
      selectedProperty: {
        breakdown: ['fruit'],
        precision: 4,
        aggregation: 'mean',
      },
    });
    expect(getByText('7.1206')).toBeInTheDocument();
  });

  it('Shows segment labels fixed to default precision if not specified in the property', () => {
    const { getByText } = renderComponent({
      clickedFeatures: [
        {
          fruit: 4.91655,
        },

        {
          fruit: 9.32467238,
        },
      ],
      selectedProperty: {
        breakdown: ['fruit'],
        aggregation: 'mean',
      },
    });
    expect(getByText('7.12')).toBeInTheDocument();
  });

  it('Does not show values <= 0', () => {
    const { queryByText } = renderComponent({
      selectedProperty: {
        breakdown: ['fruit', 'trees'],
      },
      clickedFeatures: [
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
