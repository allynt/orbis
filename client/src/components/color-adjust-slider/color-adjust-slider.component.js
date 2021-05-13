import { fade, makeStyles, Slider } from '@astrosat/astrosat-ui';
import React, { forwardRef } from 'react';
import { ColorScale } from 'utils/ColorScale';

const makeThumbStyles = (clipValue, colorScale) => ({
  backgroundColor: colorScale.get(clipValue),
  '&:hover, &:focus-visible': {
    boxShadow: `0px 0px 0px 8px ${fade(colorScale.get(clipValue), 0.16)}`,
    '@media (hover: none)': {
      boxShadow: 'none',
    },
  },
});

const useStyles = makeStyles(({ palette, typography: { pxToRem } }) => ({
  root: {
    height: pxToRem(42),
  },
  rail: {
    height: pxToRem(42),
    opacity: 1,
    border: `1px solid ${palette.grey[300]}`,
    backgroundImage: props =>
      `linear-gradient(to right, ${props.colorScale
        .getGradient('hex')
        .map(stop => `${stop.color} ${stop.stop}%`)
        .join(', ')})`,
  },
  thumb: props => ({
    bottom: 0,
    transform: 'translateY(55%)',
    width: pxToRem(20),
    height: pxToRem(24),
    borderRadius: '50% 50% 5% 5% / 45% 45% 5% 5%',
    border: `1px solid ${palette.grey[300]}`,
    '&:nth-of-type(3)': makeThumbStyles(props.clipMin, props.colorScale),
    '&:nth-of-type(4)': makeThumbStyles(props.clipMax, props.colorScale),
  }),
}));

/**
 * @typedef {{
 *  min: number
 *  max: number
 *  clipMin: number
 *  clipMax: number
 *  color: import('typings/orbis').ColorMap
 *  reversed?: boolean
 *  onSliderChange: (clip: [number, number]) => void
 *  className: string
 * }} SliderProps
 */

export const ColorAdjustSlider = forwardRef(
  /**
   * @param {SliderProps} props
   * @param {import('react').ForwardedRef<HTMLSpanElement>} ref
   */
  (
    {
      min,
      max,
      clipMin = min,
      clipMax = max,
      color,
      reversed,
      onSliderChange,
      className,
    },
    ref,
  ) => {
    const colorScale = new ColorScale({
      color,
      domain: [min, max],
      clip: [clipMin, clipMax],
      reversed,
    });
    const styles = useStyles({ colorScale, clipMin, clipMax });

    return (
      <Slider
        ref={ref}
        className={className}
        classes={styles}
        min={min}
        max={max}
        value={[clipMin, clipMax]}
        onChange={(e, value) => onSliderChange(value)}
        track={false}
      />
    );
  },
);
