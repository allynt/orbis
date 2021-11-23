import React from 'react';

import { darken, ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import {
  VictoryLine,
  VictoryScatter,
  VictoryGroup,
  VictoryLegend,
} from 'victory';

import { ChartWrapper } from 'dashboards/widgets/chart-wrapper.component';

import { useChartTheme } from '../../useChartTheme';
//import { LineChart } from '../../widgets/line-chart/line-chart.component';
import { BaseChart } from '../../widgets/base-chart/base-chart.component';

/**
 * @param {{
 *  x: string
 *  ranges: string[]
 *  xLabel?: string
 *  yLabel?: string
 *  data: any[]
 * }} props
 */
const HousingApprovals = ({
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
  data,
}) => {
  const chartTheme = useChartTheme();

  const renderLineChart = width => {
    return ranges?.map((range, i) => {
      const color = chartTheme.colors[i % chartTheme.colors.length],
        scatterWidth = width / 2,
        props = {
          data,
          x,
          y: range,
        };

      return (
        <VictoryGroup key={range}>
          <VictoryLine {...props} style={{ data: { stroke: color } }} />
          <VictoryScatter
            {...props}
            style={{
              data: {
                stroke: darken(color, 0.2),
                width: scatterWidth,
                fill: color,
              },
            }}
          />
        </VictoryGroup>
      );
    });
  };

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <div style={{ display: 'flex', height: '5rem' }}>
        <div style={{ width: '33%' }}>
          <VictoryLegend
            x={50}
            y={50}
            centerTitle
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fontSize: 50 },
            }}
            data={[
              {
                name: '2019',
                symbol: { fill: chartTheme.colors[0], type: 'line' },
              },
              {
                name: '2020',
                symbol: { fill: chartTheme.colors[1], type: 'line' },
              },
            ]}
          />
        </div>
        <div style={{ width: '33%', padding: '1rem' }}>
          <DateRangeFilter />
        </div>
        <div style={{ width: '33%', padding: '1rem' }}>
          <ToggleButtonGroup
            size="small"
            value="monthly"
            orientation="horizontal"
          >
            <ToggleButton key="monthly" value="monthly">
              Monthly
            </ToggleButton>
            <ToggleButton key="cumulative" value="cumulative">
              Cumulative
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <div style={{ height: '70%' }}>
        <BaseChart
          xLabel={xLabel}
          yLabel={yLabel}
          renderWidget={renderLineChart}
        />
      </div>
    </ChartWrapper>
  );
};

export { HousingApprovals };
