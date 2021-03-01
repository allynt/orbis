import { aggregateTimeSeries } from 'analysis-panel/aggregateTimeSeries';
import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import { format } from 'date-fns';
import { get } from 'lodash';
import { DEFAULT_DECIMAL_PRECISION } from 'map/map.constants';
import * as React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

/** @type {import("typings/orbis").AnalysisPanelComponent<{info?: string, timestampFormat?: string}, import('typings/orbis').PolygonPickedMapFeature>} */
export const PropertyTimeSeriesChart = ({
  clickedFeatures,
  selectedProperty,
  info,
  timestampFormat = 'MMM - yy',
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

  return (
    <SidePanelSection title="Time Series" defaultExpanded info={info}>
      {!!clickedFeatures ? (
        <VictoryChart
          theme={chartTheme}
          padding={{ top: 10, right: 10, bottom: 110, left: 100 }}
          domainPadding={10}
        >
          <VictoryAxis
            fixLabelOverlap
            tickLabelComponent={<VictoryLabel angle={-90} dx={-40} />}
            tickFormat={timestamp =>
              format(new Date(timestamp), timestampFormat)
            }
          />
          <VictoryAxis
            dependentAxis
            tickFormat={v =>
              v.toFixed(selectedProperty.precision ?? DEFAULT_DECIMAL_PRECISION)
            }
          />
          <VictoryLine {...sharedProps} />
          <VictoryScatter
            {...sharedProps}
            labelComponent={<VictoryTooltip />}
            labels={({ datum }) =>
              `${format(new Date(datum.timestamp), timestampFormat)}: ${
                datum.value
              }`
            }
            size={5}
          />
        </VictoryChart>
      ) : null}
    </SidePanelSection>
  );
};