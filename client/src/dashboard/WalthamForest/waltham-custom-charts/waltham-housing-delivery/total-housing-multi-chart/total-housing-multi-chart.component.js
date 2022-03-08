import React, { useMemo } from 'react';

import { darken } from '@astrosat/astrosat-ui';

import {
  VictoryGroup,
  VictoryBar,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TENURE_DATA_TYPES,
  TARGET_LEGEND_DATA,
} from 'dashboard/WalthamForest/waltham.constants';

import { totalHousingTransformer } from './total-housing-transformer/total-housing-transformer';

/**
 * @param {{
 *  apiData: object[]
 *  userTargetData: object[]
 *  filteredTimeline: string[]
 * }} props
 */
const TotalHousingMultiChart = ({
  apiData,
  userTargetData,
  filteredTimeline,
}) => {
  const { walthamChartColors } = useChartTheme();

  // Transform API/target data to correct data shape, and create a
  // reliable timeline form earliest total year -> latest API data year
  const transformerOutput = useMemo(
    () => totalHousingTransformer(apiData, userTargetData, filteredTimeline),
    [apiData, userTargetData, filteredTimeline],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  // This can easily be upgraded later to cut out a 5-year window
  // based on a start/end parameter, but hardcoded for now
  const filteredApiData = [
    transformedData[0].slice(-5),
    transformedData[1].slice(-5),
  ];
  const filteredTargetData = transformedTargets?.slice(-5);

  const apiLegendData = Object.values(TENURE_DATA_TYPES).map((type, i) => ({
    name: type,
    color: walthamChartColors.totalHousing[i],
  }));

  const renderTotalHousingLegend = width => (
    <WalthamCustomLegend
      apiLegendData={apiLegendData}
      targetLegendData={!!filteredTargetData ? TARGET_LEGEND_DATA : null}
      width={width}
    />
  );

  const renderTotalHousingMultiChart = width => {
    const { barWidth, offset } = GroupedWidthCalculator(filteredApiData, width);

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: filteredTargetData,
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
              labels={({ datum }) => `Total: ${datum.y}`}
              labelComponent={FlyoutTooltip()}
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
              labelComponent={FlyoutTooltip()}
              labels={({ datum }) => `Total: ${datum._y}`}
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
