import React, { useMemo } from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

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
  // reliable timeline form earliest year -> latest year
  const transformerOutput = useMemo(
    () => totalHousingTransformer(apiData, userTargetData, filteredTimeline),
    [apiData, userTargetData, filteredTimeline],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const apiLegendData = Object.values(TENURE_DATA_TYPES).map((type, i) => ({
    name: type,
    color: walthamChartColors.totalHousing[i],
  }));

  const TotalHousingGroupChart = ({ width }) => {
    const { barWidth, offset } = GroupedWidthCalculator(transformedData, width);
    return (
      <VictoryGroup offset={offset}>
        {transformedData?.map((arr, i) => (
          <VictoryBar
            // eslint-disable-next-line react/no-array-index-key
            key={`dataset-${i}`}
            data={arr}
            labels={({ datum }) => `${datum.y}`}
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
    );
  };

  const TargetLineChart = ({ width }) => {
    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: transformedTargets,
      };
    return (
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
    );
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
            xLabel="Financial Year"
            financialYear
          >
            {TotalHousingGroupChart({ width })}
            {!!transformedTargets ? TargetLineChart({ width }) : null}
          </BaseChart>
        </>
      )}
    </StyledParentSize>
  );
};

export { TotalHousingMultiChart };
