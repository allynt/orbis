import { fade, makeStyles } from '@astrosat/astrosat-ui';
import React, { forwardRef } from 'react';
import { ColorScale } from 'utils/ColorScale';
import { MaterialColormapRangeSlider } from 'components/material-colormap-range-slider/material-colormap-range-slider.component';

/**
 * @param {number} clipValue
 * @param {ColorScale} colorScale
 */
const makeThumbStyles = (clipValue, colorScale) => {
  const color = /** @type {string} */ (colorScale.get(clipValue));

  return {
    backgroundColor: color,
    '&:hover, &:focus-visible': {
      boxShadow: `0px 0px 0px 8px ${fade(color, 0.16)}`,
      '@media (hover: none)': {
        boxShadow: 'none',
      },
    },
  };
};

const useStyles = makeStyles(({ palette, typography: { pxToRem } }) => ({
  thumb: props => ({
    bottom: 0,
    transform: 'translate(-20%, 50%)',
    width: pxToRem(20),
    height: pxToRem(24),
    borderRadius: '50% 50% 5% 5% / 45% 45% 5% 5%',
    border: `1px solid ${palette.grey[300]}`,
    '&[data-index="0"]': makeThumbStyles(props.clipMin, props.colorScale),
    '&[data-index="1"]': makeThumbStyles(props.clipMax, props.colorScale),
  }),
}));

/**
 * @typedef {Omit<import('components/material-colormap-range-slider/material-colormap-range-slider.component').ColormapRangeSliderProps, 'value'>} SliderProps
 */

export const ColorAdjustSlider = forwardRef(
  /**
   * @param {SliderProps} props
   * @param {import('react').ForwardedRef<HTMLSpanElement>} ref
   */
  (
    { min, max, clipMin = min, clipMax = max, colorMap, reversed, ...rest },
    ref,
  ) => {
    const colorScale = new ColorScale({
      color: colorMap,
      domain: [min, max],
      clip: [clipMin, clipMax],
      reversed,
    });
    const styles = useStyles({ colorScale, clipMin, clipMax });

    return (
      <MaterialColormapRangeSlider
        ref={ref}
        classes={styles}
        min={min}
        max={max}
        clipMin={clipMin}
        clipMax={clipMax}
        value={[clipMin, clipMax]}
        reversed={reversed}
        colorMap={colorMap}
        {...rest}
      />
    );
  },
);
