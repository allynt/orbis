import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ColormapRangeSlider } from './colormap-range-slider.component';

describe('<ColormapRangeSlider />', () => {
  it("Shows multiple marks if the thumbs haven't moved", () => {
    const { getByText } = render(<ColormapRangeSlider />);
    expect(getByText('0.00')).toBeInTheDocument();
    expect(getByText('0.50')).toBeInTheDocument();
    expect(getByText('1.00')).toBeInTheDocument();
  });

  it('Shows the values above the thumbs if they have moved', () => {
    const { getByText } = render(<ColormapRangeSlider value={[0.25, 0.75]} />);
    expect(getByText('0.25')).toBeInTheDocument();
    expect(getByText('0.75')).toBeInTheDocument();
  });

  it('Formats the ticks to the given precision', () => {
    const { getByText } = render(
      <ColormapRangeSlider value={[0.25, 0.75]} precision={1} />,
    );
    expect(getByText('0.3')).toBeInTheDocument();
    expect(getByText('0.8')).toBeInTheDocument();
  });

  it('Has a min of 1 and max of 10 if the type="decile"', () => {
    const { getByText } = render(<ColormapRangeSlider type="decile" />);
    expect(getByText('2.00')).toBeInTheDocument();
    expect(getByText('4.00')).toBeInTheDocument();
    expect(getByText('6.00')).toBeInTheDocument();
    expect(getByText('8.00')).toBeInTheDocument();
    expect(getByText('10.00')).toBeInTheDocument();
  });

  it('Calls the onChange handler when a thumb is moved', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <ColormapRangeSlider onChange={onChange} />,
    );
    fireEvent.mouseDown(getAllByRole('slider')[0], { clientX: 1 });
    expect(onChange).toBeCalledWith([0, 1]);
  });
});
