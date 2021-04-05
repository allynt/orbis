import * as React from 'react';

import { ParentSize } from '@visx/responsive';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { SidePanelSection } from 'components';
import { useChartTheme } from 'hooks/useChartTheme';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import { timeSeriesAggregationSelector } from 'map/orbs/slices/isolation-plus.slice';

/** @type {import("typings/orbis").AnalysisPanelComponent<{info?: string, timestampFormat?: string}, import('typings/orbis').PolygonPickedMapFeature>} */
export const PropertyTimeSeriesChart = ({
  clickedFeatures,
  selectedProperty,
  info,
  timestampFormat = 'MMM yy',
}) => {
  const chartTheme = useChartTheme();

  const data = useSelector(state => timeSeriesAggregationSelector(state?.orbs));

  const sharedProps = {
    data,
    x: 'timestamp',
    y: 'value',
  };

  return (
    <SidePanelSection title="Time Series" defaultExpanded info={info}>
      {!!clickedFeatures ? (
        <ParentSize>
          {({ width }) => (
            <VictoryChart
              width={width}
              height={width * 0.7}
              theme={chartTheme}
              padding={{ left: 80, top: 20, bottom: 70, right: 10 }}
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
                tickFormat={v =>
                  v.toFixed(
                    selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION,
                  )
                }
              />
              <VictoryLine {...sharedProps} />
              <VictoryScatter
                {...sharedProps}
                labelComponent={<VictoryTooltip constrainToVisibleArea />}
                labels={({ datum }) =>
                  `${format(new Date(datum.timestamp), timestampFormat)}: ${
                    datum.value
                  }`
                }
                size={3}
              />
            </VictoryChart>
          )}
        </ParentSize>
      ) : null}
    </SidePanelSection>
  );
};
