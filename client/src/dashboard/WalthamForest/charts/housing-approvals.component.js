import React, { useState } from 'react';

import { Grid, ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import { VictoryLegend } from 'victory';

import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { LineChart } from '../../charts/line-chart/line-chart.component';
import * as dataInput from '../../mock-data/waltham-forest/mock_approvals_granted';
import { useChartTheme } from '../../useChartTheme';
import { HOUSING_APPROVAL_BUTTON_LABELS } from '../waltham.constants';

const HousingApprovalsComponent = ({
  data = dataInput.properties,
  x = 'Month',
  ranges = ['2019', '2020'],
  xLabel = 'Year',
  yLabel = 'Data Property Name / Unit',
}) => {
  const chartTheme = useChartTheme();
  let chartNames = ranges;
  const [showing, setShowing] = useState(
    HOUSING_APPROVAL_BUTTON_LABELS[0].label,
  );

  const handleToggleClick = (_, newValue) => {
    if (!newValue) return;
    setShowing(newValue);
  };

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <Grid container spacing={1}>
        <Grid container spacing={1}>
          <div style={{ display: 'flex', width: '33%', height: '5rem' }}>
            <VictoryLegend
              x={50}
              y={50}
              centerTitle
              orientation="horizontal"
              gutter={40}
              style={{
                labels: { fontSize: 60 },
              }}
              data={[
                {
                  name: chartNames[0],
                  symbol: { fill: chartTheme.colors[0], type: 'line' },
                },
                {
                  name: chartNames[1],
                  symbol: { fill: chartTheme.colors[1], type: 'line' },
                },
              ]}
            />
          </div>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <ToggleButtonGroup
              size="small"
              value={showing}
              orientation="horizontal"
              onChange={handleToggleClick}
            >
              <ToggleButton
                key={HOUSING_APPROVAL_BUTTON_LABELS[0].label}
                value={HOUSING_APPROVAL_BUTTON_LABELS[0].label}
              >
                Monthly
              </ToggleButton>
              <ToggleButton
                key={HOUSING_APPROVAL_BUTTON_LABELS[1].label}
                value={HOUSING_APPROVAL_BUTTON_LABELS[1].label}
              >
                Cumulative
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <LineChart
            x={x}
            ranges={ranges}
            xLabel={xLabel}
            yLabel={yLabel}
            data={data?.find(p => p.name === showing)?.data}
          />
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export { HousingApprovalsComponent };
