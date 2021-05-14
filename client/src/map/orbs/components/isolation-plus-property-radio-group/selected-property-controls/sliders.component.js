import {
  Button,
  Switch,
  Fade,
  Grid,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';
import { ColorAdjustSlider } from 'components/color-adjust-slider/color-adjust-slider.component';
import { MaterialColormapRangeSlider } from 'components/material-colormap-range-slider/material-colormap-range-slider.component';
import React, { useState } from 'react';
import { isRealValue } from 'utils/isRealValue';

const useStyles = makeStyles(
  ({ spacing, typography: { caption, pxToRem } }) => ({
    slidersGridItem: {
      position: 'relative',
      height: pxToRem(100),
      padding: spacing(2),
    },
    slider: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: `calc(320px - ${spacing(6)})`,
      marginLeft: spacing(2),
    },
    label: { ...caption },
  }),
);

/**
 * @param {{
 *  selectedProperty: import('typings/orbis').ContinuousProperty
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
  const [isAdjustingColor, setIsAdjustingColor] = useState(false);
  const styles = useStyles();

  const { min, max, clip_min, clip_max, precision, type } =
    selectedProperty || {};
  const { color, colormap_reversed } =
    selectedProperty?.application?.orbis?.display || {};
  const clipMin = clipRange?.[0] ?? clip_min ?? min;
  const clipMax = clipRange?.[1] ?? clip_max ?? max;

  const handleResetClick = () => {
    if (isAdjustingColor) {
      return onClipRangeChange([clip_min ?? min, clip_max ?? max]);
    }
    return onRangeFilterChange([min, max]);
  };

  return (
    <>
      <Grid item>
        <Typography>Range Filter</Typography>
      </Grid>
      <Grid
        item
        component="label"
        container
        alignItems="center"
        spacing={1}
        className={styles.label}
      >
        <Grid item>Adjust Filter</Grid>
        <Grid item>
          <Switch
            checked={isAdjustingColor}
            onChange={(_, checked) => setIsAdjustingColor(checked)}
            name="Slider Toggle"
          />
        </Grid>
        <Grid item>Adjust Color</Grid>
      </Grid>
      <Grid item xs={12} className={styles.slidersGridItem}>
        <Fade in={isAdjustingColor} direction="left" unmountOnExit>
          <ColorAdjustSlider
            className={styles.slider}
            data-testid="color-slider"
            color={color}
            min={min}
            max={max}
            clipMin={clipMin}
            clipMax={clipMax}
            reversed={colormap_reversed}
            onSliderChange={onClipRangeChange}
          />
        </Fade>
        <Fade in={!isAdjustingColor} direction="right" unmountOnExit>
          <MaterialColormapRangeSlider
            className={styles.slider}
            type={type}
            color={color}
            min={isRealValue(min) ? min : 0}
            max={isRealValue(max) ? max : 1}
            clipMin={clipMin}
            clipMax={clipMax}
            value={filterRange}
            onChange={onRangeFilterChange}
            reversed={colormap_reversed}
            precision={precision}
          />
        </Fade>
      </Grid>
      <Grid item container justify="center">
        <Button color="secondary" size="small" onClick={handleResetClick}>
          Reset
        </Button>
      </Grid>
    </>
  );
};
