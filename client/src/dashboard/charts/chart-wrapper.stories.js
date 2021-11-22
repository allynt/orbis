import React from 'react';

import { ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import { VictoryLegend, VictoryChart } from 'victory';

import { DateRangeFilter } from 'map/orbs/components/date-range-filter/date-range-filter.component';

import * as data from '../mock-data/waltham-forest/mock_approvals_granted';
import { useChartTheme } from '../useChartTheme';
import { ChartWrapper } from './chart-wrapper.component';
import { LineChart } from './line-chart/line-chart.component';

export default {
  title: 'Dashboards/Widgets/ChartWrapper',
};

const Template = args => {
  const chartTheme = useChartTheme();
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
        <LineChart {...args} />;
      </div>
    </ChartWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: data.properties.find(p => p.name === 'Monthly').data,
  x: 'Month',
  ranges: ['2019', '2020'],
  xLabel: 'Year',
  yLabel: 'Data Property Name / Unit',
};
