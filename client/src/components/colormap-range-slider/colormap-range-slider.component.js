import * as React from 'react';
import ContinuousColorMapRangeSlider from './continuous-colormap-range-slider.component';
import DecileColorMapRangeSlider from './decile-colormap-range-slider.component';

/**
 * @param {{
 *   color: ColorMap
 *   type: PropertyType
 *   units?: string
 *   domain?: [number, number]
 *   snap?: boolean
 *   onChange?: (domain: [number, number]) => void
 * }} props
 */
const ColorMapRangeSlider = ({ type, ...rest }) => {
  switch (type) {
    case 'decile':
      return <DecileColorMapRangeSlider {...rest} />;
    default:
      return <ContinuousColorMapRangeSlider {...rest} />;
  }
};

export default ColorMapRangeSlider;
