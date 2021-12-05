import React, { useState, useMemo } from 'react';

import { Grid, ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import { VictoryLegend } from 'victory';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { LineChart } from 'dashboard/charts/line-chart/line-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { lineDataTransformer } from '../../utils';
import { HOUSING_APPROVAL_DATA_TYPES } from '../../waltham.constants';

const HousingApprovalsComponent = ({
  data,
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
}) => {
  const chartTheme = useChartTheme();
  const [selectedDataType, setSelectedDataType] = useState(
    HOUSING_APPROVAL_DATA_TYPES.monthly,
  );

  const handleToggleClick = (_, newValue) => {
    if (!newValue) return;
    setSelectedDataType(newValue);
  };

  const dataByType = useMemo(
    () =>
      lineDataTransformer(data?.find(p => p.name === selectedDataType)?.data),
    [data, selectedDataType],
  );

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <Grid container spacing={1}>
        <Grid item container spacing={1}>
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
                  name: ranges[0],
                  symbol: { fill: chartTheme.colors[0], type: 'line' },
                },
                {
                  name: ranges[1],
                  symbol: { fill: chartTheme.colors[1], type: 'line' },
                },
              ]}
            />
          </div>

          <Grid item xs={4}>
            <ToggleButtonGroup
              size="small"
              value={selectedDataType}
              orientation="horizontal"
              onChange={handleToggleClick}
            >
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.monthly}>
                {HOUSING_APPROVAL_DATA_TYPES.monthly}
              </ToggleButton>
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.cumulative}>
                {HOUSING_APPROVAL_DATA_TYPES.cumulative}
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
            data={dataByType}
          />
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};

export { HousingApprovalsComponent };
