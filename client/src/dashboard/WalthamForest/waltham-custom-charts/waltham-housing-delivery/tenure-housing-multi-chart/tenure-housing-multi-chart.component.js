import React, { useMemo } from 'react';

import { darken } from '@astrosat/astrosat-ui';

import {
  VictoryBar,
  VictoryStack,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import {
  userTargetTransformer,
  getTargetTotals,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TARGET_LEGEND_DATA,
  housingTenureTypes,
} from 'dashboard/WalthamForest/waltham.constants';

/**
 * @param {{
 *  apiData: any[]
 *  userTargetData: any[]
 *  tenureType: string
 * }} props
 */
const TenureHousingMultiChart = ({ apiData, userTargetData, tenureType }) => {
  console.log('apitest', apiData);
  const { tenureStackColors } = useChartTheme();

  const tenureTypes = Object.values(housingTenureTypes),
    stackColors = Object.values(tenureStackColors);

  const targets = useMemo(
    () =>
      !tenureType
        ? userTargetTransformer(getTargetTotals(userTargetData))
        : userTargetTransformer(userTargetData?.[tenureType]),
    [tenureType, userTargetData],
  );

  if (!apiData) return null;

  const apiLegendData = tenureTypes.map((range, i) => ({
    name: range,
    color: stackColors[i],
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

    const ranges = !!tenureType
      ? [housingTenureTypes[tenureType]]
      : tenureTypes;

    const colorScale = !!tenureType
      ? [tenureStackColors[tenureType]]
      : stackColors;

    const color = '#d13aff',
      scatterWidth = width / 2,
      props = {
        data: targets,
        x: 'x',
        y: 'y',
      };
    console.log('RENGES', ranges);

    //const yearList = apiData.map(item => item['Year']);
    const fieldList = Object.keys(apiData[0]);
    const fieldsToAddUp = fieldList.filter(item => item !== 'Year');
    let totalsArray = [];
    for (let index in apiData) {
      let total = 0;
      for (let fieldName of fieldsToAddUp) {
        total += apiData[index][fieldName];
      }
      totalsArray.push(total);
    }

    console.error('TOTALS ARRAY', totalsArray);
    return (
      <VictoryGroup>
        {/* data from API fetch */}
        <VictoryGroup>
          <VictoryStack colorScale={colorScale}>
            {ranges?.map(range => {
              console.log('range', range);
              return (
                <VictoryBar
                  labelComponent={
                    <VictoryTooltip
                      pointerOrientation="right"
                      pointerWidth={25}
                      flyoutHeight={60}
                      flyoutWidth={200}
                      // x={40}
                      // y={40}
                      constrainToVisibleArea
                      style={{
                        fill: 'black',
                      }}
                      flyoutStyle={{
                        stroke: 'none',
                        fill: '#f6be00',
                      }}
                    />
                  }
                  key={range}
                  data={apiData}
                  x="Year"
                  y={range}
                  labels={totalsArray}
                  style={{
                    data: { width: barWidth },
                  }}
                />
              );
            })}
          </VictoryStack>
        </VictoryGroup>

        {/* user uploaded target data */}
        {!!userTargetData && !!targets ? (
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
