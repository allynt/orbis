import * as React from 'react';
import ContinuousColorMapRangeSlider from './continuous-colormap-range-slider.component';
import DecileColorMapRangeSlider from './decile-colormap-range-slider.component';

/** @type {import('./colormap-range-slider.component').StyleProps} */
const STYLE = {
  brushStyle: { fill: 'transparent' },
  handleStyle: {
    fill: '#f6be00',
    width: 5,
    rx: 3,
    height: 95,
    transform: 'translateY(-5px)',
  },
  tickLabelStyle: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 24,
    fill: '#fff',
    transition: 'opacity 150ms ease',
  },
};

/** @param {import('./colormap-range-slider.component').ColorMapRangeSliderProps} props */
const ColorMapRangeSlider = ({ type, ...rest }) => {
  const height = 130;
  const padding = { top: 40, bottom: 175, left: 55, right: 55 };
  switch (type) {
    case 'decile':
      return (
        <DecileColorMapRangeSlider
          height={height}
          padding={padding}
          {...STYLE}
          {...rest}
        />
      );
    default:
      return (
        <ContinuousColorMapRangeSlider
          height={height}
          padding={padding}
          {...STYLE}
          {...rest}
        />
      );
  }
};

export default ColorMapRangeSlider;
