import React from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import {
  groupedDataTransformer,
  userTargetTransformer,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TENURE_DATA_TYPES,
  TARGET_LEGEND_DATA,
} from 'dashboard/WalthamForest/waltham.constants';

const TotalHousingMultiChart = ({ apiData, userTargetData }) => {
  const { walthamChartColors } = useChartTheme();

  if (!apiData) return null;

  // Transform API/target data to correct data shape, and create a
  // reliable timeline on which to base the data
  const transformedData = groupedDataTransformer(apiData, userTargetData);
  const transformedTargets = userTargetTransformer(userTargetData);

  // hardcoded to return most recent 5 years' data for now, but can be easily
  // configured to cut out a 5-year window based on a start/end parameter
  const filteredApiData = [
    transformedData[0].slice(-5),
    transformedData[1].slice(-5),
  ];
  const filteredTargetData = transformedTargets.slice(-5);

  const apiLegendData = Object.values(TENURE_DATA_TYPES).map((type, i) => ({
    name: type,
    color: walthamChartColors.totalHousing[i],
  }));

  const renderTotalHousingLegend = width => (
    <WalthamCustomLegend
      apiLegendData={apiLegendData}
      targetLegendData={!!transformedTargets ? TARGET_LEGEND_DATA : null}
      width={width}
    />
  );

  const renderTotalHousingMultiChart = width => {
    const { barWidth, offset } = GroupedWidthCalculator(transformedData, width);

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: filteredTargetData,
        x: 'x',
        y: 'y',
      };
    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup offset={offset}>
          {filteredApiData?.map((arr, i) => (
            <VictoryBar
              // eslint-disable-next-line react/no-array-index-key
              key={`dataset-${i}`}
              data={arr}
              style={{
                data: {
                  fill: walthamChartColors.totalHousing[i],
                  width: barWidth,
                },
              }}
            />
          ))}
        </VictoryGroup>

        {/* user uploaded target data */}
        {!!filteredTargetData ? (
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
      renderChart={renderTotalHousingMultiChart}
      renderLegend={renderTotalHousingLegend}
    />
  );
};

export { TotalHousingMultiChart };
