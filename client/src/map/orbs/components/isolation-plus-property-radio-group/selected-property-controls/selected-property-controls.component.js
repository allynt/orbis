import { Grid } from '@astrosat/astrosat-ui';
import { format } from 'date-fns';
import React from 'react';
import { DateStepper } from '../../date-stepper/date-stepper.component';
import { DiscretePropertyLegend } from '../discrete-property-legend/discrete-property-legend.component';
import { Sliders } from './sliders.component';

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
      <DiscretePropertyLegend
        property={
          /** @type {import('typings/orbis').DiscreteProperty} */ (selectedProperty)
        }
      />
    ) : (
      <Sliders
        clipRange={clipRange}
        filterRange={filterRange}
        onClipRangeChange={onClipRangeChange}
        onRangeFilterChange={onRangeFilterChange}
        selectedProperty={
          /** @type {import('typings/orbis').ContinuousProperty} */ (selectedProperty)
        }
      />
    )}
  </>
);
