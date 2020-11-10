import * as React from 'react';
import ContinuousColorMapRangeSlider from './continuous-colormap-range-slider.component';
import DecileColorMapRangeSlider from './decile-colormap-range-slider.component';

/**
 * @typedef StyleProps
 * @property {React.CSSProperties} brushStyle
 * @property {React.CSSProperties} handleStyle
 * @property {React.CSSProperties} tickLabelStyle
 */

/**
 * @typedef {{
 *   color: ColorMap
 *   onChange?: (domain: [number, number]) => void
 * } & StyleProps} SharedProps
 */

/** @type {StyleProps} */
const STYLE = {
  brushStyle: { fill: 'transparent' },
  handleStyle: {
    fill: '#f6be00',
    width: 5,
    rx: 3,
    height: 210,
    transform: 'translateY(-5px)',
  },
  tickLabelStyle: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 24,
    fill: '#fff',
    transition: 'opacity 150ms ease',
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
      return <DecileColorMapRangeSlider {...STYLE} {...rest} />;
    default:
      return <ContinuousColorMapRangeSlider {...STYLE} {...rest} />;
  }
};

export default ColorMapRangeSlider;
