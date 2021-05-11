import { Grid, styled, Typography } from '@astrosat/astrosat-ui';
import { ColorMapRangeSlider } from 'components';
import { ColorAdjustSlider } from 'components/color-adjust-slider/color-adjust-slider.component';
import { format } from 'date-fns';
import React from 'react';
import { isRealValue } from 'utils/isRealValue';
import { DateStepper } from '../../date-stepper/date-stepper.component';
import { DiscretePropertyLegend } from '../discrete-property-legend/discrete-property-legend.component';

const LastGridItem = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

/**
 * @param {{
 *  selectedProperty: import('typings/orbis').Property
 *  onDateChange: (event: React.ChangeEvent<{}>, date: number) => void
 *  selectedTimestamp: number
 *  filterRange: [number, number]
 *  onRangeFilterChange: (value: [number, number]) => void
 *  clipRange?: [number, number]
 *  onClipRangeChange: (value: [number, number]) => void
 * }} props
 */
export const SelectedPropertyControls = ({
  selectedProperty,
  onDateChange,
  selectedTimestamp,
  filterRange,
  onRangeFilterChange,
  clipRange,
  onClipRangeChange,
}) => (
  <>
    {selectedProperty.timeseries &&
    Array.isArray(selectedProperty.timeseries_timestamps) ? (
      <Grid item xs={12}>
        <DateStepper
          dates={selectedProperty.timeseries_timestamps.map((timestamp, i) => {
            const date = new Date(timestamp);
            const shouldLabel =
              i === 0 ||
              i === selectedProperty.timeseries_timestamps.length - 1 ||
              i ===
                Math.floor(selectedProperty.timeseries_timestamps.length / 2);

            return {
              value: date.getTime(),
              label: shouldLabel ? format(date, 'dd-MM-yy') : undefined,
            };
          })}
          defaultValue={new Date(
            selectedProperty.timeseries_latest_timestamp,
          ).getTime()}
          min={new Date(selectedProperty.timeseries_timestamps[0]).getTime()}
          max={new Date(
            selectedProperty.timeseries_timestamps[
              selectedProperty.timeseries_timestamps.length - 1
            ],
          ).getTime()}
          onChange={onDateChange}
          value={selectedTimestamp}
        />
      </Grid>
    ) : null}
    {selectedProperty.type === 'discrete' ? (
      <DiscretePropertyLegend property={selectedProperty} />
    ) : (
      <>
        <Grid item xs={12}>
          <Typography variant="body2">Color Adjust</Typography>
        </Grid>
        <Grid item xs={12}>
          <ColorAdjustSlider
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
            onSliderChange={onClipRangeChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Range Filter</Typography>
        </Grid>
        <LastGridItem item xs={12}>
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
              !!selectedProperty?.application?.orbis?.display?.colormap_reversed
            }
            precision={selectedProperty?.precision}
          />
        </LastGridItem>
      </>
    )}
  </>
);
