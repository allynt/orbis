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
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
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

  const transformerOutput = useMemo(
    () => tenureHousingTransformer(apiData, userTargetData, filteredTimeline),
    [apiData, userTargetData, filteredTimeline],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const apiLegendData = Object.entries(housingTenureTypes).map(
    ([key, value]) => ({
      name: value,
      color: tenureStackColors[key],
    }),
  );

  const TenureHousingStackChart = ({ width }) => {
    const barWidth = width / 20;

    const ranges = !!tenureType
      ? [housingTenureTypes[tenureType]]
      : Object.values(housingTenureTypes);

    const colorScale = !!tenureType
      ? [tenureStackColors[tenureType]]
      : Object.values(tenureStackColors);

    let totalsArray = labelsForArrayOfObjects(
      transformedData,
      'startYear',
      item => `Total: ${item}`,
    );
    return (
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
    );
  };

  const Targets = ({ width }) => {
    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: transformedTargets,
        x: 'x',
        y: 'y',
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
            xLabel="Year"
            financialYear
          >
            {TenureHousingStackChart({ width })}
            {!!transformedTargets ? Targets({ width }) : null}
          </BaseChart>
        </>
      )}
    </StyledParentSize>
  );
};

export { TenureHousingMultiChart };
