import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { ColorAdjustSlider } from './color-adjust-slider.component';

describe('<ColorAdjustSlider />', () => {
  it('Calls onSliderChange when one of the thumbs is moved', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <ColorAdjustSlider min={0} max={10} onChange={onChange} />,
    );
    fireEvent.mouseDown(getAllByRole('slider')[0], {
      clientX: 100,
      clientY: 300,
    });
    expect(onChange).toBeCalled();
  });
});
