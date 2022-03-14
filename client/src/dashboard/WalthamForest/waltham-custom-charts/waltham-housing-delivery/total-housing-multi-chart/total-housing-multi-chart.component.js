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
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
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
 *  filteredTimeline: number[]
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

  const apiLegendData = Object.entries(TENURE_DATA_TYPES).map(
    ([key, value]) => ({
      name: value,
      color: walthamChartColors.totalHousing[key],
    }),
  );

  const TotalHousingGroupChart = ({ width }) => {
    const { barWidth, offset } = GroupedWidthCalculator(transformedData, width);
    return (
      <VictoryGroup offset={offset}>
        {Object.entries(transformedData)?.map(([key, value]) => (
          <VictoryBar
            key={key}
            data={value}
            labels={({ datum }) => `Total: ${datum.y}`}
            labelComponent={FlyoutTooltip()}
            style={{
              data: {
                fill: walthamChartColors.totalHousing[key],
                width: barWidth,
              },
            }}
          />
        ))}
      </VictoryGroup>
    );
  };

  const TotalHousingLineChart = ({ width }) => {
    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: transformedTargets,
      };
    return !!transformedTargets ? (
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
    ) : null;
  };

  return (
    <StyledParentSize>
      {({ width }) => (
        <>
          <WalthamCustomLegend
            apiLegendData={apiLegendData}
            targetLegendData={!!transformedTargets ? TARGET_LEGEND_DATA : null}
            width={width}
          />
          <BaseChart
            width={width}
            yLabel="Housing Delivery in Units"
            xLabel="Year"
            financialYear
          >
            {TotalHousingGroupChart({ width })}
            {TotalHousingLineChart({ width })}
          </BaseChart>
        </>
      )}
    </StyledParentSize>
  );
};

export { TotalHousingMultiChart };
