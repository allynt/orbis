import { useTheme } from '@astrosat/astrosat-ui';
import * as React from 'react';
import ContinuousColorMapRangeSlider from './continuous-colormap-range-slider.component';
import DecileColorMapRangeSlider from './decile-colormap-range-slider.component';

/** @type {import('./colormap-range-slider.component').StyleProps} */

/** @param {import('./colormap-range-slider.component').ColorMapRangeSliderProps} props */
export const ColorMapRangeSlider = ({ type, ...rest }) => {
  const theme = useTheme();
  const style = {
    brushStyle: { fill: 'transparent' },
    handleStyle: {
      fill: theme.palette.primary.main,
      width: 5,
      rx: 3,
      height: 95,
      transform: 'translateY(-5px)',
    },
    tickLabelStyle: {
      fontFamily: theme.typography.fontFamily,
      fontSize: 24,
      fill: theme.palette.text.primary,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shortest,
      }),
    },
  };
  const height = 130;
  const padding = { top: 40, bottom: 175, left: 55, right: 55 };
  switch (type) {
    case 'decile':
      return (
        <DecileColorMapRangeSlider
          height={height}
          padding={padding}
          {...style}
          {...rest}
        />
      );
    default:
      return (
        <ContinuousColorMapRangeSlider
          height={height}
          padding={padding}
          {...style}
          {...rest}
        />
      );
  }
};
