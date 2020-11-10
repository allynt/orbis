import * as React from 'react';
import ContinuousColorMapRangeSlider from './continuous-colormap-range-slider.component';
import DecileColorMapRangeSlider from './decile-colormap-range-slider.component';

/**
 * @typedef {{
 *   brushStyle: React.CSSProperties
 *   handleStyle: React.CSSProperties
 *   color: ColorMap
 *   onChange?: (domain: [number, number]) => void
 * }} SharedProps
 */

/** @type {{ brushStyle: React.CSSProperties, handleStyle: React.CSSProperties }} */
const BRUSH_STYLE = {
  brushStyle: { fill: 'transparent' },
  handleStyle: {
    fill: '#f6be00',
    width: 5,
    rx: 3,
    height: 210,
    transform: 'translateY(-5px)',
  },
};

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
      return <DecileColorMapRangeSlider {...BRUSH_STYLE} {...rest} />;
    default:
      return <ContinuousColorMapRangeSlider {...BRUSH_STYLE} {...rest} />;
  }
};

export default ColorMapRangeSlider;
