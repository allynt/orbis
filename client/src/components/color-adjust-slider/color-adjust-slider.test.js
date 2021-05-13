import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ColorAdjustSlider } from './color-adjust-slider.component';

describe('<ColorAdjustSlider />', () => {
  it('Calls onSliderChange when one of the thumbs is moved', () => {
    const onSliderChange = jest.fn();
    const { getAllByRole } = render(
      <ColorAdjustSlider min={0} max={10} onSliderChange={onSliderChange} />,
    );
    fireEvent.mouseDown(getAllByRole('slider')[0], {
      clientX: 100,
      clientY: 300,
    });
    expect(onSliderChange).toBeCalled();
  });
});
