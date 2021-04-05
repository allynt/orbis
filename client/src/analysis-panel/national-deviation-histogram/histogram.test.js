import React from 'react';
import { render } from '@testing-library/react';
import { Histogram } from './histogram.component';

const renderComponent = (line, log = false) =>
  render(
    <Histogram
      domain={[0, 10]}
      line={line}
      data={Array(10)
        .fill(undefined)
        .map((_, i) => ({ x: i, y: i * 10000 }))}
      dependentScale={log && 'log'}
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

  it('uses log scale when dependentScale is log', () => {
    const { getByText } = renderComponent(5, true);
    expect(getByText('10 k')).toBeInTheDocument();
  });
});
