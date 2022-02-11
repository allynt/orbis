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
import { getTargetTotals } from 'dashboard/WalthamForest/utils';
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
 * }} props
 */
const TenureHousingMultiChart = ({ apiData, userTargetData, tenureType }) => {
  const { tenureStackColors } = useChartTheme();

  const tenureTypes = Object.values(housingTenureTypes),
    stackColors = Object.values(tenureStackColors);

  // TODO: do this after transformer so API data isn't re-processed?
  const targets = !tenureType
    ? getTargetTotals(userTargetData)
    : userTargetData?.[tenureType];

  const transformerOutput = useMemo(
    () => tenureHousingTransformer(apiData, targets),
    [apiData, targets],
  );

  if (!transformerOutput) return null;

  const { transformedData, transformedTargets } = transformerOutput;

  const filteredApiData = transformedData.slice(-5),
    filteredTargetData = transformedTargets?.slice(-5);

  const apiLegendData = tenureTypes.map((range, i) => ({
    name: range,
    color: stackColors[i],
  }));

  const renderTenureHousingLegend = width => {
    return (
      <WalthamCustomLegend
        apiLegendData={apiLegendData}
        targetLegendData={!!filteredTargetData ? TARGET_LEGEND_DATA : null}
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
        data: filteredTargetData,
        x: 'x',
        y: 'y',
      };

    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup>
          <VictoryStack colorScale={colorScale}>
            {ranges?.map(range => (
              <VictoryBar
                key={range}
                data={filteredApiData}
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
        {!!filteredTargetData && !!targets ? (
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
