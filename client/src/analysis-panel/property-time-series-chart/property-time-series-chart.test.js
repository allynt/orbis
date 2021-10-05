// @ts-nocheck
import * as React from 'react';

import { render, screen } from 'test/test-utils';

import { PropertyTimeSeriesChart } from './property-time-series-chart.component';

const setup = clickedFeatures => {
  const property = { label: 'Hello', name: 'test' };

  const state = {
    orbs: {
      isolationPlus: {
        property,
        clickedFeatures,
      },
    },
  };

  render(
    <PropertyTimeSeriesChart
      selectedProperty={property}
      clickedFeatures={clickedFeatures}
      timestampFormat={'yyyy'}
    />,
    { state },
  );
};

describe('<PropertyTimeSeriesChart />', () => {
  it('Renders just the title if there are no clicked features', () => {
    setup(undefined);

    expect(screen.getByText('Time Series')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
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

    setup(clickedFeatures);

    expect(screen.getByText('2077')).toBeInTheDocument();
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

    setup(clickedFeatures);

    expect(screen.getAllByText(/3/).length).toBeGreaterThanOrEqual(1);
  });
});
