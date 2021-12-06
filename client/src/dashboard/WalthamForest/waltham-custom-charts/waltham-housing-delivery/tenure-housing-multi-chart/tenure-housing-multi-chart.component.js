import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import {
  VictoryBar,
  VictoryStack,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { TARGET_LEGEND_DATA } from 'dashboard/WalthamForest/waltham.constants';

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 *  tenureType: string
 * }} props
 */
const TenureHousingMultiChart = ({ apiData, userTargetData, tenureType }) => {
  const { walthamChartColors } = useChartTheme();

  if (!apiData) return null;

  const allTenureTypes = [
    'Affordable Rent',
    'Intermediate',
    'Market',
    'Social Rented',
    'Private Rented Sector',
  ];

  const apiLegendData = allTenureTypes.map((range, i) => ({
    name: range,
    color: walthamChartColors.tenureHousing[i],
  }));

  const renderTenureHousingLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={!!userTargetData ? TARGET_LEGEND_DATA : null}
        width={width}
      />
    );
  };

  const renderTenureHousingMultiChart = width => {
    const barWidth = width / 20;

    const ranges = !!tenureType ? [tenureType] : allTenureTypes;

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: userTargetData,
        x: 'x',
        y: 'y',
      };

    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup>
          <VictoryStack>
            {ranges?.map(range => (
              <VictoryBar
                key={range}
                data={apiData}
                x="Year"
                y={range}
                style={{
                  data: { width: barWidth },
                }}
              />
            ))}
          </VictoryStack>
        </VictoryGroup>

        {/* user uploaded target data */}
        {!!userTargetData ? (
          <VictoryGroup>
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
            <VictoryLine {...props} style={{ data: { stroke: color } }} />
          </VictoryGroup>
        ) : null}
      </VictoryGroup>
    );
  };

  return (
    <BaseChart
      yLabel="Housing Delivery in Units"
      xLabel="Year"
      renderChart={renderTenureHousingMultiChart}
      renderLegend={renderTenureHousingLegend}
    />
  );
};

export { TenureHousingMultiChart };
