import * as React from 'react';

import { ParentSize } from '@visx/responsive';
import { format } from 'date-fns';
import { get } from 'lodash';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { aggregateTimeSeries } from 'analysis-panel/aggregateTimeSeries';
import { SidePanelSection, WrappingChartLabel } from 'components';
import { useChartTheme } from 'hooks/useChartTheme';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import { isValidDateString } from 'utils/dates';

/**
 * @type {import("typings/orbis").AnalysisPanelComponent<{
 *    info?: string,
 *    timestampFormat?: string,
 *    selectedTimestamp?: number
 *  },
 *  import('typings').PolygonPickedMapFeature
 * >}
 */
export const PropertyTimeSeriesChart = ({
  clickedFeatures,
  selectedProperty,
  selectedTimestamp,
  info,
  timestampFormat = 'MMM yy',
}) => {
  const chartTheme = useChartTheme();

  const data =
    clickedFeatures?.length > 1
      ? aggregateTimeSeries(clickedFeatures, selectedProperty)
      : get(
          clickedFeatures?.[0],
          `object.properties.${selectedProperty?.name}`,
        );

  const sharedProps = {
    data,
    x: 'timestamp',
    y: 'value',
  };

  const getPointSize = ({ datum }) => {
    if (
      new Date(datum.timestamp).getTime() === selectedTimestamp ||
      (!selectedTimestamp &&
        new Date(datum.timestamp).getTime() ===
          new Date(selectedProperty.timeseries_latest_timestamp).getTime())
    )
      return 6;
    return 3;
  };

  return (
    <SidePanelSection title="Time Series" defaultExpanded info={info}>
      {!!clickedFeatures ? (
        <ParentSize>
          {({ width }) => {
            const height = width * 0.7,
              padding = { left: 80, top: 20, bottom: 70, right: 10 },
              paddingY = padding.top + padding.bottom;
            return (
              <VictoryChart
                width={width}
                height={height}
                theme={chartTheme}
                padding={padding}
                domainPadding={10}
              >
                <VictoryAxis
                  fixLabelOverlap
                  tickLabelComponent={<VictoryLabel angle={-90} dx={-25} />}
                  tickFormat={timestamp =>
                    format(new Date(timestamp), timestampFormat)
                  }
                  offsetY={70}
                />
                <VictoryAxis
                  crossAxis={false}
                  dependentAxis
                  label={selectedProperty.units}
                  axisLabelComponent={
                    <WrappingChartLabel width={height - paddingY} />
                  }
                  tickFormat={v =>
                    v.toFixed(
                      selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION,
                    )
                  }
                  style={{
                    axisLabel: {
                      padding: padding.left - 28,
                    },
                  }}
                />
                <VictoryLine {...sharedProps} />
                <VictoryScatter
                  {...sharedProps}
                  labelComponent={<VictoryTooltip constrainToVisibleArea />}
                  labels={({ datum }) =>
                    `${
                      isValidDateString(datum.timestamp)
                        ? format(new Date(datum.timestamp), timestampFormat)
                        : datum.timestamp
                    }: ${datum.value}`
                  }
                  size={getPointSize}
                />
              </VictoryChart>
            );
          }}
        </ParentSize>
      ) : null}
    </SidePanelSection>
  );
};
