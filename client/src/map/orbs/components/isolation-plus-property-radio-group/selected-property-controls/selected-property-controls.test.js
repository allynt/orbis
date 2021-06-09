import React from 'react';

import { render } from '@testing-library/react';

import { SelectedPropertyControls } from './selected-property-controls.component';

describe('<SelectedPropertyControls />', () => {
  it('Shows a legend for discrete properties', () => {
    const { getByRole } = render(
      <SelectedPropertyControls
        selectedProperty={{
          name: 'testProperty',
          type: 'discrete',
          categories: {
            apple: {
              color: 'green',
            },
            orange: {
              color: 'orange',
            },
          },
        }}
      />,
    );
    expect(getByRole('list')).toBeInTheDocument();
  });

  it('shows a date stepper if the selected property is timeseries and has a list of timestamps', () => {
    const { getByText } = render(
      <SelectedPropertyControls
        selectedProperty={{
          min: 0,
          max: 1,
          timeseries: true,
          timeseries_latest_timestamp: new Date(2020, 0, 1).toISOString(),
          timeseries_timestamps: [new Date(2020, 0, 1).toISOString()],
        }}
      />,
    );
    expect(getByText(/timeseries/i)).toBeInTheDocument();
  });

  it('shows labels for the start, middle, and end dates', () => {
    const { getByText } = render(
      <SelectedPropertyControls
        selectedProperty={{
          min: 0,
          max: 1,
          timeseries: true,
          timeseries_latest_timestamp: new Date(2020, 0, 1).toISOString(),
          timeseries_timestamps: [
            new Date(2016, 0, 1).toISOString(),
            new Date(2017, 0, 1).toISOString(),
            new Date(2018, 0, 1).toISOString(),
            new Date(2019, 0, 1).toISOString(),
            new Date(2020, 0, 1).toISOString(),
          ],
        }}
      />,
    );
    expect(getByText('01-01-16')).toBeInTheDocument();
    expect(getByText('01-01-18')).toBeInTheDocument();
    expect(getByText('01-01-20')).toBeInTheDocument();
  });
});
