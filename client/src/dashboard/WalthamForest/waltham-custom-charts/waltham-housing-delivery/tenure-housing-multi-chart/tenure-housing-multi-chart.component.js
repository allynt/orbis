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

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 *  tenureType: string
 * }} props
 */
const TenureHousingMultiChart = ({ apiData, userTargetData, tenureType }) => {
  // const chartTheme = useChartTheme();

  if (!apiData) return null;

  const apiLegendData = [
      {
        name: 'Affordable Rent',
        color: '#37e5d8',
      },
      {
        name: 'Intermediate',
        color: '#75b7b2',
      },
      {
        name: 'Market',
        color: '#adeab0',
      },
      {
        name: 'Social Rented',
        color: '#05c3ff',
      },
      {
        name: 'Private Rented Sector',
        color: '#d6ea69',
      },
    ],
    targetLegendData = {
      name: 'Housing Requirement',
      color: '#d13aff',
    };

  const renderTenureHousingLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={!!userTargetData ? targetLegendData : null}
        width={width}
      />
    );
  };

  const renderTenureHousingMultiChart = width => {
    const barWidth = width / 20;

    const ranges = !!tenureType
      ? [tenureType]
      : [
          'Affordable Rent',
          'Intermediate',
          'Market',
          'Social Rented',
          'Private Rented Sector',
        ];

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
