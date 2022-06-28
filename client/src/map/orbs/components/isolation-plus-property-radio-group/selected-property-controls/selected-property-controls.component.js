import React from 'react';

import { Grid } from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import { ColorLegend } from 'components';

import { DateStepper } from '../../date-stepper/date-stepper.component';
import { Sliders } from './sliders.component';

/**
 * @param {{
 *  selectedProperty: import('typings').Property
 *  onDateChange: (event: React.ChangeEvent<{}>, date: number) => void
 *  selectedTimestamp: number
 *  filterRange: [number, number]
 *  onRangeFilterChange: (value: [number, number]) => void
 *  clipRange?: [number, number]
 *  onClipRangeChange: (value: [number, number]) => void
 *  tickDuration?: number
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
  tickDuration,
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
          tickDuration={tickDuration}
        />
      </Grid>
    ) : null}
    {selectedProperty.type === 'discrete' ? (
      // @ts-ignore
      <ColorLegend categories={selectedProperty.categories} />
    ) : selectedProperty.disableRangeFilter === true ? null : (
      <Sliders
        clipRange={clipRange}
        filterRange={filterRange}
        onClipRangeChange={onClipRangeChange}
        onRangeFilterChange={onRangeFilterChange}
        selectedProperty={
          /** @type {import('typings').ContinuousProperty} */ (selectedProperty)
        }
      />
    )}
  </>
);
