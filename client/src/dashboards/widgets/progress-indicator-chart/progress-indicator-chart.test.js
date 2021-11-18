import React from 'react';

import { render } from '@testing-library/react';

import { ProgressIndicatorChart } from './progress-indicator-chart.component';

const TEST_PROPERTY = {
  name: 'Housing Delivery',
  target: 300,
  progress: 122,
};

describe('Target Progress Indicator', () => {
  it('renders', () => {
    const { getByText } = render(
      <ProgressIndicatorChart property={TEST_PROPERTY} />,
    );

    expect(getByText('Target 300 Units')).toBeInTheDocument();
  });

  it('shows default message when no target is provided', () => {
    const { getByText } = render(
      <ProgressIndicatorChart
        property={{ ...TEST_PROPERTY, target: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });

  it('shows default message when no progress is provided', () => {
    const { getByText } = render(
      <ProgressIndicatorChart
        property={{ ...TEST_PROPERTY, progress: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });
});
