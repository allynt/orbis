import React from 'react';

import { render } from '@testing-library/react';

import { TargetProgressIndicator } from './target-progress-indicator.component';

const TEST_SOURCE = {
  name: 'Housing Delivery',
  title: 'Test Title',
  info: 'This is some test info.',
  target: 300,
  progress: 122,
};

describe('Target Progress Indicator', () => {
  it('renders', () => {
    const { getByText } = render(
      <TargetProgressIndicator source={TEST_SOURCE} />,
    );

    expect(getByText('Target 300 Units')).toBeInTheDocument();
  });

  it('shows no target message when no target is provided', () => {
    const { getByText } = render(
      <TargetProgressIndicator
        source={{ ...TEST_SOURCE, target: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });

  it('shows no target message when no progress is provided', () => {
    const { getByText } = render(
      <TargetProgressIndicator
        source={{ ...TEST_SOURCE, progress: undefined }}
      />,
    );

    expect(getByText('Housing Delivery Target Required')).toBeInTheDocument();
  });
});
