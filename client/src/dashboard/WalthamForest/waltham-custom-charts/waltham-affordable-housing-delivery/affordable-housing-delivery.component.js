import React from 'react';

import {
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
//import * as MOCK_DATA from 'dashboard/mock-data/waltham-forest/mock_affordable_housing';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';

import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';

/**
 * @param {{
 *  apiData: {any} // chart data
 * }} props
 */
const AffordableHousingDelivery = ({ data }) => {
  const { walthamChartColors } = useChartTheme();

  if (!data || !data?.properties) return null;
  const actualData = data?.properties[0]?.data;

  let totalsArray = labelsForArrayOfObjectsInclusive(
    actualData,
    ['Affordable Housing'],
    item => `${item}%`,
  );

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];

  const renderLineChart = width => {
    const color = '#f6be00';
    const y_values = actualData.map(item => item['Affordable Housing']);
    const y_max = Math.max(...y_values);
    const props = {
      data: actualData,
      x: 'year',
      y: 'Affordable Housing',
      domain: { y: [0, y_max > 100 ? y_max : 100] },
    };
    return (
      <VictoryGroup key="y">
        <VictoryLine {...props} style={{ data: { stroke: color } }} />
        <VictoryScatter
          labelComponent={
            <VictoryTooltip
              pointerOrientation="right"
              pointerWidth={25}
              flyoutHeight={40}
              flyoutWidth={100}
              constrainToVisibleArea
              style={{
                fill: 'black',
              }}
              flyoutStyle={{
                stroke: 'none',
                fill: '#f6be00',
              }}
            />
          }
          {...props}
          labels={totalsArray}
          style={{ data: { stroke: color } }}
        />
      </VictoryGroup>
    );
  };

  const renderAffordableHousingDeliveryLegend = width => {
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
      title="Affordable Housing Delivery 2016 - 2021 (%)"
      info="This shows the % of affordable housing delivered each year"
    >
      <BaseChart
        yLabel="Affordable Housing %"
        xLabel="Year"
        renderChart={renderLineChart}
        renderLegend={renderAffordableHousingDeliveryLegend}
      />
    </ChartWrapper>
  );
};

export { AffordableHousingDelivery };
