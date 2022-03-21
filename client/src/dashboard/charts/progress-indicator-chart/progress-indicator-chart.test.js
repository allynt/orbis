import React from 'react';

import { render, waitFor } from '@testing-library/react';

import { ProgressIndicatorChart } from './progress-indicator-chart.component';

const TEST_PROPERTY = {
  name: 'Housing Delivery',
  target: 400,
  progress: 100,
};

// TODO: fix tests, 2 skipped

describe('Target Progress Indicator', () => {
  it('calculates percentage values,', async () => {
    const { getByText, getAllByText } = render(
      <ProgressIndicatorChart property={TEST_PROPERTY} />,
    );

    await waitFor(() => {
      expect(getAllByText('25%')[0]).toBeInTheDocument();
      expect(getByText('Target 400 Units')).toBeInTheDocument();
    });
  });

  it('shows 100% when target is 0,', async () => {
    const property = {
      name: 'Housing Delivery',
      target: 0,
      progress: 150,
    };
    const { getByText, getAllByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    await waitFor(() => {
      expect(getAllByText('100%')[0]).toBeInTheDocument();
      expect(getByText('Target 0 Units')).toBeInTheDocument();
    });
  });

  xit('shows 0% when progress is 0,', async () => {
    const property = {
      name: 'Housing Delivery',
      target: 150,
      progress: 0,
    };
    const { getByText, getAllByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    await waitFor(() => {
      expect(getAllByText('0%')[0]).toBeInTheDocument();
      expect(getByText('Target 150 Units')).toBeInTheDocument();
    });
  });

  xit('shows 100% if both targets and API data are 0,', async () => {
    const property = {
      name: 'Housing Delivery',
      target: 0,
      progress: 0,
    };
    const { getByText, getAllByText } = render(
      <ProgressIndicatorChart property={property} />,
    );

    waitFor(() => {
      expect(getAllByText('100%')[0]).toBeInTheDocument();
      expect(getByText('Target 0 Units')).toBeInTheDocument();
    });
  });

  it('shows default message when no target is provided', () => {
    const { getByText } = render(
      <ProgressIndicatorChart
        property={{ ...TEST_PROPERTY, target: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });

  it('shows default message when progress is undefined', () => {
    const { getByText } = render(
      <ProgressIndicatorChart
        property={{ ...TEST_PROPERTY, progress: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });

  it('shows default message when progress is null', () => {
    const { getByText } = render(
      <ProgressIndicatorChart
        property={{ ...TEST_PROPERTY, progress: null }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });

  it('shows default message when progress is NaN', () => {
    const { getByText } = render(
      <ProgressIndicatorChart property={{ ...TEST_PROPERTY, progress: NaN }} />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });
});
