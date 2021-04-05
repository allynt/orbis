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
  it('renders', () => {
    renderComponent(5);
  });
});
