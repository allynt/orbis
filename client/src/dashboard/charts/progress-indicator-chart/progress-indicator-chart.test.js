import React from 'react';

import { render } from '@testing-library/react';

import { ProgressIndicatorChart } from './progress-indicator-chart.component';

const TEST_PROPERTY = {
  name: 'Housing Delivery',
  target: 400,
  progress: 100,
};

describe('Target Progress Indicator', () => {
  it('renders', () => {
    const { getByText } = render(
      <ProgressIndicatorChart property={TEST_PROPERTY} />,
    );

    expect(getByText('Target 400 Units')).toBeInTheDocument();
  });

  it('calculates percentage values,', () => {
    const { getByText } = render(
      <ProgressIndicatorChart property={TEST_PROPERTY} />,
    );

    expect(getByText('25%')).toBeInTheDocument();
    expect(getByText('Target 400 Units')).toBeInTheDocument();
  });

  it('shows 100% when target is 0,', () => {
    const property = {
      name: 'Housing Delivery',
      target: 0,
      progress: 150,
    };
    const { getByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('Target 0 Units')).toBeInTheDocument();
  });

  it('shows 0% when progress is 0,', () => {
    const property = {
      name: 'Housing Delivery',
      target: 150,
      progress: 0,
    };
    const { getByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    expect(getByText('0%')).toBeInTheDocument();
    expect(getByText('Target 150 Units')).toBeInTheDocument();
  });

  it('shows 100% if both targets and API data are 0,', () => {
    const property = {
      name: 'Housing Delivery',
      target: 0,
      progress: 0,
    };
    const { getByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('Target 0 Units')).toBeInTheDocument();
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
        property={{ ...TEST_PROPERTY, progress: null }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });
});
