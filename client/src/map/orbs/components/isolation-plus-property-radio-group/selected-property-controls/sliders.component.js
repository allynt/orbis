import React, { useState } from 'react';

import {
  Button,
  Fade,
  Grid,
  makeStyles,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@astrosat/astrosat-ui';

import { ColorAdjustSlider, ColormapRangeSlider } from 'components';
import { isRealValue } from 'utils/isRealValue';

const SCALE_VALUES = {
  filter: 'Adjust Filter',
  colour: 'Adjust Colour',
};

const useStyles = makeStyles(({ spacing, typography: { pxToRem } }) => ({
  slidersGridItem: {
    position: 'relative',
    height: pxToRem(90),
    padding: spacing(2),
  },
  slider: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: `calc(320px - ${spacing(6)})`,
    margin: spacing(1, 'auto', 2),
  },
}));

/**
 * @param {{
 *  selectedProperty: import('typings').ContinuousProperty
 *  filterRange: [number, number]
 *  onRangeFilterChange: (value: [number, number]) => void
 *  clipRange?: [number, number]
 *  onClipRangeChange: (value: [number, number]) => void
 * }} props
 */
export const Sliders = ({
  selectedProperty,
  clipRange,
  onClipRangeChange,
  filterRange,
  onRangeFilterChange,
}) => {
  const [scale, setScale] = useState(SCALE_VALUES.filter);
  const styles = useStyles();

  const { min, max, clip_min, clip_max, precision, type } =
    selectedProperty || {};
  const { color, colormap_reversed } =
    selectedProperty?.application?.orbis?.display || {};
  const clipMin = clipRange?.[0] ?? clip_min ?? min;
  const clipMax = clipRange?.[1] ?? clip_max ?? max;

  const handleResetClick = () => {
    if (scale === SCALE_VALUES.colour) {
      return onClipRangeChange([clip_min ?? min, clip_max ?? max]);
    }
    return onRangeFilterChange([min, max]);
  };

  const handleToggleChange = (_, newValue) => {
    if (!newValue || scale === newValue) return;
    return setScale(newValue);
  };

  const sliderProps = {
    colorMap: color,
    min: isRealValue(min) ? min : 0,
    max: isRealValue(max) ? max : 1,
    clipMin,
    clipMax,
    reversed: colormap_reversed,
    className: styles.slider,
    precision,
  };

  return (
    <>
      <Grid item>
        <Typography>Range Filter</Typography>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          size="small"
          value={scale}
          onChange={handleToggleChange}
        >
          <ToggleButton value={SCALE_VALUES.filter}>
            {SCALE_VALUES.filter}
          </ToggleButton>
          <ToggleButton value={SCALE_VALUES.colour}>
            {SCALE_VALUES.colour}
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12} className={styles.slidersGridItem}>
        <Fade in={scale === SCALE_VALUES.colour} unmountOnExit>
          <ColorAdjustSlider
            {...sliderProps}
            data-testid="color-slider"
            onChange={onClipRangeChange}
          />
        </Fade>
        <Fade in={scale === SCALE_VALUES.filter} unmountOnExit>
          <ColormapRangeSlider
            {...sliderProps}
            data-testid="range-slider"
            type={type}
            value={filterRange}
            onChange={onRangeFilterChange}
          />
        </Fade>
      </Grid>
      <Grid item container justifyContent="center">
        <Button color="secondary" size="small" onClick={handleResetClick}>
          Reset
        </Button>
      </Grid>
    </>
  );
};
