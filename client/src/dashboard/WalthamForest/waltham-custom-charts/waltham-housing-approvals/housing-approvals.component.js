import React, { useState, useMemo } from 'react';

import { Grid, ToggleButtonGroup, ToggleButton } from '@astrosat/astrosat-ui';

import { VictoryLegend } from 'victory';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { LineChart } from 'dashboard/charts/line-chart/line-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';

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

  const apiLegendData = [
    {
      name: '2019',
      color: chartTheme.colors[0],
    },
    {
      name: '2020',
      color: chartTheme.colors[1],
    },
  ];

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <Grid container spacing={1}>
        <Grid item container justifyContent="space-between">
          <Grid item>
            <WalthamCustomLegend apiLegendData={apiLegendData} />
          </Grid>

          <Grid item>
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
