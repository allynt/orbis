import { Switch } from '@astrosat/astrosat-ui';
import { Grid, makeStyles, Slide, Typography } from '@material-ui/core';
import { ColorMapRangeSlider } from 'components';
import { ColorAdjustSlider } from 'components/color-adjust-slider/color-adjust-slider.component';
import React, { useState } from 'react';
import { isRealValue } from 'utils/isRealValue';

const useStyles = makeStyles({
  slidersGridItem: {
    position: 'relative',
  },
  slider: { position: 'absolute' },
});

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

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2">Range Filter</Typography>
      </Grid>
      <Grid component="label" container alignItems="center" spacing={1}>
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
        <Slide in={isAdjustingColor} direction="left" unmountOnExit>
          <ColorAdjustSlider
            className={styles.slider}
            color={selectedProperty?.application?.orbis?.display?.color}
            min={selectedProperty.min}
            max={selectedProperty.max}
            clipMin={
              clipRange?.[0] ??
              selectedProperty?.clip_min ??
              selectedProperty.min
            }
            clipMax={
              clipRange?.[1] ??
              selectedProperty?.clip_max ??
              selectedProperty.max
            }
            reversed={
              !!selectedProperty?.application?.orbis?.display?.colormap_reversed
            }
            onSliderChange={onClipRangeChange}
          />
        </Slide>
        <Slide in={!isAdjustingColor} direction="right" unmountOnExit>
          <div className={styles.slider}>
            <ColorMapRangeSlider
              type={selectedProperty?.type}
              color={selectedProperty?.application?.orbis?.display?.color}
              domain={[
                isRealValue(selectedProperty.min) ? selectedProperty.min : 0,
                isRealValue(selectedProperty.max) ? selectedProperty.max : 1,
              ]}
              clip={[
                clipRange?.[0] ??
                  selectedProperty.clip_min ??
                  selectedProperty.min,
                clipRange?.[1] ??
                  selectedProperty.clip_max ??
                  selectedProperty.max,
              ]}
              value={filterRange}
              onChange={onRangeFilterChange}
              reversed={
                !!selectedProperty?.application?.orbis?.display
                  ?.colormap_reversed
              }
              precision={selectedProperty?.precision}
            />
          </div>
        </Slide>
      </Grid>
    </>
  );
};
