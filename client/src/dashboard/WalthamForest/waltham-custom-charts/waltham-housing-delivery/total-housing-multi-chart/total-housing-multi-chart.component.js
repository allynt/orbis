import React, { useMemo } from 'react';

import { darken } from '@astrosat/astrosat-ui';

import { VictoryGroup, VictoryBar, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from 'dashboard/charts/base-chart/base-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';
import { GroupedWidthCalculator } from 'dashboard/utils';
import { userTargetTransformer } from 'dashboard/WalthamForest/utils';
import { WalthamCustomLegend } from 'dashboard/WalthamForest/waltham-custom-legend/waltham-custom-legend.component';
import {
  TENURE_DATA_TYPES,
  TARGET_LEGEND_DATA,
} from 'dashboard/WalthamForest/waltham.constants';

/**
 * This function is necessary because the data does not match what Victory
 * expects. Specifically, the 'gross' and 'net' values must be split into
 * separate arrays so that they can be uses to render separate chart datasets.
 *
 * It is also used to create a stable timeline of earliest-latest year,
 * that can house the data on the chart, allowing missing values from
 * either dataset, padding them with `null` values.
 *
 * @param {object[]} data
 * @param {object[]} targets
 * @returns {{
 *  x: string
 *  y: number
 * }[][]}
 */
export const dataTransformer = (data, targets) => {
  if (!data) return;

  const apiYears = data.map(obj => {
    const [year] = obj.Year.split('-');
    return +year;
  });

  // Object.keys(targets).length? Deleted targets could be empty object
  // What are uninitiated vs cleared targets?
  const targetYears = !!targets
    ? Object.keys(targets).map(key => {
        const [year] = key.split('-');
        return +year;
      })
    : [];

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears);
  const max = Math.max(...allYears);

  let timeline = [];
  for (let i = min; i <= max; i++) {
    timeline = [...timeline, `${i}-${i + 1}`];
  }

  return Object.values(
    timeline.reduce(
      (acc, year) => {
        const obj = data.find(datum => datum.Year === year) ?? {};
        return {
          gross: [
            ...acc.gross,
            { x: `${year}`, y: obj['Total Gross'] ?? null },
          ],
          net: [...acc.net, { x: `${year}`, y: obj['Total Net'] ?? null }],
        };
      },
      { gross: [], net: [] },
    ),
  );
};

const TotalHousingMultiChart = ({ apiData, userTargetData }) => {
  const { walthamChartColors } = useChartTheme();

  // Transform API/target data to correct data shape, and create a
  // reliable timeline on which to base the data
  const transformedData = useMemo(
    () => dataTransformer(apiData, userTargetData),
    [apiData, userTargetData],
  );

  const transformedTargets = useMemo(
    () => userTargetTransformer(userTargetData),
    [userTargetData],
  );

  if (!transformedData) return null;

  // Can be easily configured to cut out a 5-year window based on a
  // start/end parameter, but not in scope of ticket
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
    const { barWidth, offset } = GroupedWidthCalculator(filteredApiData, width);

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
