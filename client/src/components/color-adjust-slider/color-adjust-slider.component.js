import { fade, makeStyles, Slider } from '@astrosat/astrosat-ui';
import React from 'react';
import { ColorScale } from 'utils/ColorScale';

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
    '&:nth-of-type(3)': {
      backgroundColor: props.colorScale.get(props.clipMin),
      '&:hover, &:focus-visible': {
        boxShadow: `0px 0px 0px 8px ${fade(
          props.colorScale.get(props.clipMin),
          0.16,
        )}`,
        '@media (hover: none)': {
          boxShadow: 'none',
        },
      },
    },
    '&:nth-of-type(4)': {
      backgroundColor: props.colorScale.get(props.clipMax),
      '&:hover, &:focus-visible': {
        boxShadow: `0px 0px 0px 8px ${fade(
          props.colorScale.get(props.clipMax),
          0.16,
        )}`,
        '@media (hover: none)': {
          boxShadow: 'none',
        },
      },
    },
  }),
}));

/**
 * @param {{
 *  min: number
 *  max: number
 *  clipMin: number
 *  clipMax: number
 * color: import('typings/orbis').ColorMap
 *  onSliderChange: (clip: [number, number]) => void
 * }} props
 */
export const ColorAdjustSlider = ({
  min,
  max,
  clipMin,
  clipMax,
  color,
  onSliderChange,
}) => {
  const colorScale = new ColorScale({
    color,
    domain: [min, max],
    clip: [clipMin, clipMax],
  });
  const styles = useStyles({ colorScale, clipMin, clipMax });

  return (
    <Slider
      classes={styles}
      min={min}
      max={max}
      value={[clipMin, clipMax]}
      onChange={(e, value) => onSliderChange(value)}
      track={false}
    />
  );
};
