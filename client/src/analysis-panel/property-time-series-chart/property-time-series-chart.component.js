import { aggregateTimeSeries } from 'analysis-panel/aggregateTimeSeries';
import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import { format } from 'date-fns';
import { get } from 'lodash';
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
        <VictoryChart theme={chartTheme} domainPadding={10}>
          <VictoryAxis
            fixLabelOverlap
            tickLabelComponent={<VictoryLabel angle={-90} dx={-25} />}
            tickFormat={timestamp =>
              format(new Date(timestamp), timestampFormat)
            }
          />
          <VictoryAxis dependentAxis />
          <VictoryLine {...sharedProps} />
          <VictoryScatter
            {...sharedProps}
            labelComponent={<VictoryTooltip />}
            labels={({ datum }) => datum.value}
            size={5}
          />
        </VictoryChart>
      ) : null}
    </SidePanelSection>
  );
};
