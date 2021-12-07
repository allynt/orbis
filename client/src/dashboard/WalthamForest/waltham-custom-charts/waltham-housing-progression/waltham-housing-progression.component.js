import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine } from 'victory';

import { StackedBarChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';

const useStyles = makeStyles(theme => ({
  legendAndButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    width: '40%',
  },
}));

const HousingProgressionComponent = ({
  data,
  x = 'x',
  ranges = ['y'],
  xLabel = '',
  yLabel = '',
}) => {
  const { walthamChartColors } = useChartTheme();
  const styles = useStyles({});

  const apiLegendData = [
    {
      name: 'Actual 2019',
      color: walthamChartColors.housingApproval[0],
    },
    {
      name: 'Actual 2020',
      color: walthamChartColors.housingApproval[1],
    },
  ];

  const renderHousingProgressionLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={null}
        width={width}
      />
    );
  };

  return (
    <ChartWrapper
      title="No. of housing approvals granted over time"
      info="This shows the number of housing approvals granted over time"
    >
      <StackedBarChart
        xLabel="Number Of Units"
        yLabel="Financial Year"
        x="Year"
        ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
        data={data}
        renderLegend={renderHousingProgressionLegend}
      />
    </ChartWrapper>
  );
};

export { HousingProgressionComponent };
