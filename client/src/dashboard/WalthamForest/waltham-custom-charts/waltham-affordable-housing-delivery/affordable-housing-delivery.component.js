import React from 'react';

import { ParentSize } from '@visx/responsive';
import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import {
  computePercentages,
  getLastNYearRange,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { yellowStyle } from 'dashboard/WalthamForest/waltham.constants';

import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';

/**
 * @param {{
 *  data: {any} // chart data
 *  userOrbState: {object} // orb state
 * }} props
 */
const AffordableHousingDelivery = ({ data, userOrbState }) => {
  const { walthamChartColors } = useChartTheme();

  const actualData = data?.properties[0]?.data; // API data
  const chartTitle = `Affordable Housing Delivery ${getLastNYearRange(5)} (%)`;

  let percentageData = computePercentages(
    actualData,
    userOrbState.affordableHousing,
    'Affordable Housing',
  );

  const gotNoData =
    percentageData && percentageData.every(item => !item['Affordable Housing']);

  let totalsArray = labelsForArrayOfObjectsInclusive(
    percentageData,
    ['Affordable Housing'],
    item => `${item.toFixed(2)}%`,
  );

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];

  const renderLineChart = width => {
    if (!actualData || !percentageData) return null;
    const y_values = percentageData.map(item => item['Affordable Housing']);
    const y_max = Math.max(...y_values);
    const props = {
      data: percentageData,
      x: 'year',
      y: 'Affordable Housing',
      domain: { y: [0, y_max > 100 ? y_max : 100] },
    };
    return (
      <VictoryGroup>
        <VictoryLine {...props} style={yellowStyle} />
        <VictoryScatter
          labelComponent={FlyoutTooltip()}
          {...props}
          labels={totalsArray}
          style={yellowStyle}
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
      title={chartTitle}
      info="This shows the % of affordable housing delivered each year"
      style={{ height: '370px' }}
    >
      {gotNoData ? (
        <ParentSize>
          {({ width, height }) => (
            <h4>Please enter affordable housing delivery % targets</h4>
          )}
        </ParentSize>
      ) : (
        <BaseChart
          yLabel="Affordable Housing %"
          xLabel="Year"
          renderChart={renderLineChart}
          renderLegend={renderAffordableHousingDeliveryLegend}
        />
      )}
    </ChartWrapper>
  );
};
export { AffordableHousingDelivery };
