import { Typography } from '@material-ui/core';
import { ColorMapRangeSlider } from 'components';
import { format } from 'date-fns';
import React from 'react';
import { isRealValue } from 'utils/isRealValue';
import { DateStepper } from '../../date-stepper/date-stepper.component';
import { DiscretePropertyLegend } from '../discrete-property-legend/discrete-property-legend.component';

/**
 * @param {{
 *  selectedProperty: import('typings/orbis').Property
 *  onDateChange: (event: React.ChangeEvent<{}>, date: number) => void
 *  selectedTimestamp: number
 *  filterRange: [number, number]
 *  onRangeFilterChange: (value: [number, number]) => void
 * }} props
 */
export const SelectedPropertyControls = ({
  selectedProperty,
  onDateChange,
  selectedTimestamp,
  filterRange,
  onRangeFilterChange,
}) => (
  <>
    {selectedProperty.timeseries &&
    Array.isArray(selectedProperty.timeseries_timestamps) ? (
      <DateStepper
        dates={selectedProperty.timeseries_timestamps.map((timestamp, i) => {
          const date = new Date(timestamp);
          const shouldLabel =
            i === 0 ||
            i === selectedProperty.timeseries_timestamps.length - 1 ||
            i === Math.floor(selectedProperty.timeseries_timestamps.length / 2);

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
    ) : null}
    {selectedProperty.type === 'discrete' ? (
      <DiscretePropertyLegend property={selectedProperty} />
    ) : (
      <>
        <Typography variant="body2" paragraph>
          Range Filter
        </Typography>
        <ColorMapRangeSlider
          type={selectedProperty?.type}
          color={selectedProperty?.application?.orbis?.display?.color}
          domain={[
            isRealValue(selectedProperty.min) ? selectedProperty.min : 0,
            isRealValue(selectedProperty.max) ? selectedProperty.max : 1,
          ]}
          clip={
            (selectedProperty.clip_min || selectedProperty.clip_max) && [
              selectedProperty.clip_min || selectedProperty.min,
              selectedProperty.clip_max || selectedProperty.max,
            ]
          }
          value={filterRange}
          onChange={onRangeFilterChange}
          reversed={
            !!selectedProperty?.application?.orbis?.display?.colormap_reversed
          }
          precision={selectedProperty?.precision}
        />
      </>
    )}
  </>
);
