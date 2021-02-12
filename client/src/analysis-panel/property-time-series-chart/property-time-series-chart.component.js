import { SidePanelSection } from 'components';
import { useChartTheme } from 'components/charts/useChartTheme';
import { format } from 'date-fns';
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
  return (
    <SidePanelSection title="Time Series" defaultExpanded info={info}>
      <VictoryChart theme={chartTheme} domainPadding={10}>
        <VictoryAxis
          fixLabelOverlap
          tickLabelComponent={<VictoryLabel angle={-90} dx={-25} />}
          tickFormat={timestamp => format(new Date(timestamp), timestampFormat)}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine
          data={clickedFeatures[0].object.properties[selectedProperty.name]}
          x="timestamp"
          y="value"
        />
        <VictoryScatter
          labelComponent={<VictoryTooltip />}
          labels={({ datum }) => datum.value}
          data={clickedFeatures[0].object.properties[selectedProperty.name]}
          x="timestamp"
          y="value"
          size={5}
          style={{
            data: {
              fill: 'white',
              stroke: '#f6be00',
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </SidePanelSection>
  );
};
