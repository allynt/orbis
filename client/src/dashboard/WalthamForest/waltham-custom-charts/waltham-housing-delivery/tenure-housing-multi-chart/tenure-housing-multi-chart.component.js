import React, { useMemo } from 'react';

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
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import { labelsForArrayOfObjects } from 'dashboard/WalthamForest/tooltips-utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TARGET_LEGEND_DATA,
  housingTenureTypes,
} from 'dashboard/WalthamForest/waltham.constants';

import { tenureHousingTransformer } from './tenure-housing-transformer/tenure-housing-transformer';

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 *  tenureType: string
 *  filteredTimeline: number[]
 * }} props
 */
const TenureHousingMultiChart = ({
  apiData,
  userTargetData,
  tenureType,
  filteredTimeline,
}) => {
  const { tenureStackColors } = useChartTheme();

  const tenureTypes = Object.values(housingTenureTypes);
  const stackColors = Object.values(tenureStackColors);

  const transformerOutput = useMemo(
    () => tenureHousingTransformer(apiData, userTargetData, filteredTimeline),
    [apiData, userTargetData, filteredTimeline],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const apiLegendData = tenureTypes.map((range, i) => ({
    name: range,
    color: stackColors[i],
  }));

  const renderTenureHousingLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={!!transformedTargets ? TARGET_LEGEND_DATA : null}
        width={width}
      />
    );
  };

  const renderTenureHousingMultiChart = width => {
    const barWidth = width / 20;

    const ranges = !!tenureType
      ? [housingTenureTypes[tenureType]]
      : tenureTypes;

    const colorScale = !!tenureType
      ? [tenureStackColors[tenureType]]
      : stackColors;

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: transformedTargets,
        x: 'x',
        y: 'y',
      };

    let totalsArray = labelsForArrayOfObjects(
      transformedData,
      'startYear',
      item => `Total: ${item}`,
    );
    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup>
          <VictoryStack colorScale={colorScale}>
            {ranges?.map(range => {
              return (
                <VictoryBar
                  key={range}
                  data={transformedData}
                  x="startYear"
                  y={range}
                  labels={totalsArray}
                  labelComponent={FlyoutTooltip()}
                  style={{
                    data: { width: barWidth },
                  }}
                />
              );
            })}
          </VictoryStack>
        </VictoryGroup>

        {/* user uploaded target data */}
        {!!transformedTargets ? (
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
      renderChart={renderTenureHousingMultiChart}
      renderLegend={renderTenureHousingLegend}
      financialYear
    />
  );
};

export { TenureHousingMultiChart };
