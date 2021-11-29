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

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 * }} props
 */
export const HousingTenureMultiChart = ({ apiData, userTargetData }) => {
  const chartTheme = useChartTheme();

  if (!apiData) return null;

  console.log('userTargetData: ', userTargetData);
  console.log('apiData: ', apiData);

  const test = [
    { x: '2016-2017', y: '2490' },
    { x: '2017-2018', y: '1275' },
    { x: '2018-2019', y: '3560' },
    { x: '2019-2020', y: '1452' },
    { x: '2020-2021', y: '5120' },
  ];

  return (
    <BaseChart
      renderChart={width => {
        const barWidth = width / 20;

        const color = chartTheme.colors[2],
          scatterWidth = width / 2,
          props2 = {
            data: test,
            x: 'x',
            y: ['y'],
          };
        return (
          <VictoryGroup>
            <VictoryStack>
              {[
                'Affordable Rent',
                'Intermediate',
                'Market',
                'Social Rented',
                'Private Rented Sector',
              ]?.map(range => (
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
            <VictoryLine {...props2} style={{ data: { stroke: color } }} />
            <VictoryScatter
              {...props2}
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
      }}
    />
  );
};
