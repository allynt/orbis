import React from 'react';

import { Grid, Typography } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { StyledParentSize } from 'dashboard/charts/styled-parent-size.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import FlyoutTooltip from 'dashboard/WalthamForest/FlyoutTooltip';
import {
  computePercentages,
  getLastNYearRange,
} from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import { yellowStyle } from 'dashboard/WalthamForest/waltham.constants';

import { labelsForArrayOfObjectsInclusive } from '../../tooltips-utils';

/**
 * @param {{
 *  data: any
 *  targets: object
 * }} props
 */
const AffordableHousingDelivery = ({ data, targets }) => {
  const { walthamChartColors } = useChartTheme();

  const chartTitle = `Affordable Housing Delivery ${getLastNYearRange(5)} (%)`;

  const percentageData = computePercentages(
    data,
    targets,
    'Affordable Housing',
  );

  const hasData = percentageData?.some(item => !!item['Affordable Housing']);

  let totalsArray = labelsForArrayOfObjectsInclusive(
    percentageData,
    ['Affordable Housing'],
    item => `${Math.round(item)}%`,
  );

  const apiLegendData = [
    {
      name: '% affordable housing delivered out of yearly target',
      color: walthamChartColors.affordableHousingDelivery[0],
    },
  ];

  const AffordableHousingLineChart = ({ width }) => {
    if (!percentageData) return null;
    const y_max = Math.max(
      ...percentageData.map(item => item['Affordable Housing']),
    );
    const props = {
      data: percentageData,
      x: 'year',
      y: 'Affordable Housing',
      domain: { y: [0, y_max > 100 ? y_max : 100] },
    };
    return (
      <VictoryGroup>
        <VictoryLine {...props} style={yellowStyle} />
        <VictoryScatter
          labelComponent={FlyoutTooltip()}
          {...props}
          labels={totalsArray}
          style={yellowStyle}
        />
      </VictoryGroup>
    );
  };

  return (
    <ChartWrapper
      title={chartTitle}
      info="This shows the % of affordable housing delivered each year"
    >
      <StyledParentSize>
        {({ width }) =>
          !hasData ? (
            <Grid
              container
              justifyContent="space-around"
              alignItems="center"
              style={{ height: '12rem' }}
            >
              <Typography variant="h4">
                Please enter affordable housing delivery % targets.
              </Typography>
            </Grid>
          ) : (
            <>
              <WalthamCustomLegend
                apiLegendData={apiLegendData}
                targetLegendData={null}
                width={width}
              />
              <BaseChart
                width={width}
                yLabel="Affordable Housing %"
                xLabel="Year"
              >
                {AffordableHousingLineChart({ width })}
              </BaseChart>
            </>
          )
        }
      </StyledParentSize>
    </ChartWrapper>
  );
};
export { AffordableHousingDelivery };
