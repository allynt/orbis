import { Button, Switch } from '@astrosat/astrosat-ui';
import { Grid, makeStyles, Slide, Typography } from '@material-ui/core';
import { ColorMapRangeSlider } from 'components';
import { ColorAdjustSlider } from 'components/color-adjust-slider/color-adjust-slider.component';
import React, { useState } from 'react';
import { isRealValue } from 'utils/isRealValue';

const useStyles = makeStyles(({ typography: { caption, pxToRem } }) => ({
  slidersGridItem: {
    position: 'relative',
    width: '100%',
    height: pxToRem(135),
  },
  slider: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  label: { ...caption },
}));

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
      <Grid item className={styles.slidersGridItem}>
        <Slide in={isAdjustingColor} direction="left" unmountOnExit>
          <ColorAdjustSlider
            data-testid="color-slider"
            className={styles.slider}
            color={color}
            min={min}
            max={max}
            clipMin={clipMin}
            clipMax={clipMax}
            reversed={colormap_reversed}
            onSliderChange={onClipRangeChange}
          />
        </Slide>
        <Slide in={!isAdjustingColor} direction="right" unmountOnExit>
          <div className={styles.slider} data-testid="range-slider">
            <ColorMapRangeSlider
              type={type}
              color={color}
              domain={[isRealValue(min) ? min : 0, isRealValue(max) ? max : 1]}
              clip={[clipMin, clipMax]}
              value={filterRange}
              onChange={onRangeFilterChange}
              reversed={colormap_reversed}
              precision={precision}
            />
          </div>
        </Slide>
      </Grid>
      <Grid item container justify="center">
        <Button color="secondary" size="small" onClick={handleResetClick}>
          Reset
        </Button>
      </Grid>
    </>
  );
};
