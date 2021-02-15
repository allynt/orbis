// @ts-nocheck
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { PropertyTimeSeriesChart } from './property-time-series-chart.component';
import userEvent from '@testing-library/user-event';

describe('<PropertyTimeSeriesChart />', () => {
  it('Renders just the title if there are no clicked features', () => {
    const { getByText, queryByText } = render(
      <PropertyTimeSeriesChart selectedProperty={{ label: 'Hello' }} />,
    );

    expect(getByText('Time Series')).toBeInTheDocument();
    expect(queryByText('Hello')).not.toBeInTheDocument();
  });

  it('Formats dates depending on the timestampFormat prop', () => {
    const { getByText } = render(
      <PropertyTimeSeriesChart
        selectedProperty={{ label: 'Hello', name: 'test' }}
        clickedFeatures={[
          {
            object: {
              properties: {
                test: [{ timestamp: '2077-10-23T00:00:00.000Z', value: 1 }],
              },
            },
          },
        ]}
        timestampFormat={'yyyy'}
      />,
    );
    expect(getByText('2077')).toBeInTheDocument();
  });

  it("Uses aggregate values if there's more than one clicked feature", () => {
    const { getAllByText } = render(
      <PropertyTimeSeriesChart
        selectedProperty={{ label: 'Hello', name: 'test' }}
        clickedFeatures={[
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
        ]}
        timestampFormat={'yyyy'}
      />,
    );
    expect(getAllByText(/3/).length).toBeGreaterThanOrEqual(1);
  });
});
