import React, { forwardRef } from 'react';

import { makeStyles, Slider } from '@astrosat/astrosat-ui';

import { scaleLinear } from 'd3-scale';

import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import { ColorScale } from 'utils/ColorScale';

const useStyles = makeStyles(
  ({ palette, spacing, typography: { pxToRem } }) => ({
    root: {
      height: pxToRem(42),
      paddingTop: spacing(2),
      paddingBottom: spacing(2),
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
    thumb: {
      height: pxToRem(54),
      width: pxToRem(10),
      borderRadius: '100vh',
    },
    mark: { display: 'none' },
    markLabel: { top: '-0.5em' },
  }),
);

/**
 * @typedef {{
 *   clipMax?: number
 *   clipMin?: number
 *   colorMap?: ColorScale['color']
 *   onChange?: (value: [number, number]) => void
 *   precision?: number
 *   reversed?: boolean
 *   type?: import('typings/orbis').PropertyType
 *   value?: [number, number]
 * } & Omit<import('@material-ui/core').SliderProps, 'onChange' | 'value'>} ColormapRangeSliderProps
 */

export const ColormapRangeSlider = forwardRef(
  /**
   * @param {ColormapRangeSliderProps} props
   * @param {import('react').ForwardedRef<HTMLSpanElement>} ref
   */
  (
    {
      max: maxProp = 1,
      min: minProp = 0,
      clipMax: clipMaxProp,
      clipMin: clipMinProp,
      colorMap,
      onChange,
      precision,
      reversed,
      type,
      value: valueProp,
      classes: classesProp,
      ...rest
    },
    ref,
  ) => {
    let min = minProp,
      max = maxProp,
      clipMin,
      clipMax;
    if (type === 'decile') {
      min = 1;
      max = 10;
    }
    clipMin = clipMinProp ?? min;
    clipMax = clipMaxProp ?? max;
    const value = valueProp ?? [min, max];

    const colorScale = new ColorScale({
      color: colorMap,
      domain: [min, max],
      clip: [clipMin, clipMax],
      reversed,
    });
    const scale = scaleLinear().domain([min, max]);
    const classes = useStyles({ colorScale });

    const hasMoved = value[0] !== min || value[1] !== max;

    /**
     * @param {React.ChangeEvent<{}>} _event
     * @param {[number, number]} value
     * @returns
     */
    const handleChange = (_event, value) => onChange(value);

    return (
      <Slider
        ref={ref}
        classes={{ ...classes, ...classesProp }}
        max={max}
        min={min}
        onChange={handleChange}
        value={[...value]}
        track={false}
        marks={(hasMoved ? value : scale.ticks(3)).map(value => ({
          value,
          label: value.toFixed(precision ?? DEFAULT_DECIMAL_PRECISION),
        }))}
        step={precision ? Number(`1e-${precision}`) : 1}
        {...rest}
      />
    );
  },
);
