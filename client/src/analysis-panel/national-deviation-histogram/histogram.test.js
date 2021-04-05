import React from 'react';
import { render } from '@testing-library/react';
import { Histogram } from './histogram.component';

const renderComponent = line =>
  render(
    <Histogram
      domain={[0, 10]}
      line={line}
      data={Array(10)
        .fill(undefined)
        .map((_, i) => ({ x: i, y: 1 }))}
    />,
  );

describe('<Histogram />', () => {
  it('shows a line if line value is provided', () => {
    const { getByTestId } = renderComponent(5);
    expect(getByTestId('line')).toBeInTheDocument();
  });

  it('does not show a line if line is not a real value', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('line')).not.toBeInTheDocument();
  });
});
