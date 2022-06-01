import React, { useMemo } from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { Text } from '@visx/text';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { getUser5YearTotals, getPastYears } from '../../utils';
import { PROGRESS_CHART_DATA } from '../../waltham.constants';

const useStyles = makeStyles(theme => ({
  header: {
    minHeight: '6ch',
  },
}));

/**
 * @param {{
 *   totalData: object
 *   tenureData: object
 *   targets: object
 * }} props
 */
const ProgressIndicators = ({ totalData, tenureData, targets }) => {
  const chartTheme = useChartTheme();
  const styles = useStyles({});
  const totalDataArray = totalData?.properties?.[0]?.data;

  const tenureCurrentYear = tenureData?.find(obj => obj.startYear === 2022);

  // TODO: this is only here because mock data needs `startYear` added and `Year` filtered out
  const adaptedTotalData = totalDataArray?.map(obj => {
    const [startYear] = obj.Year.split('-');
    return Object.entries({ startYear: Number(startYear), ...obj }).reduce(
      (acc, [key, value]) => (key === 'Year' ? acc : { ...acc, [key]: value }),
      {},
    );
  });

  // 'Gross' values tallied up for last 5 years, like ticket asks
  const past5YearsTotal = useMemo(
    () =>
      getPastYears().reduce(
        (acc, cur) =>
          (acc += adaptedTotalData?.find(d => d.startYear === cur)?.[
            'Total Gross'
          ]),
        0,
      ),
    [adaptedTotalData],
  );

  // data combined with user target for progress wheels
  const targetData = useMemo(
    () => [
      {
        ...PROGRESS_CHART_DATA.totalHousing,
        target: getUser5YearTotals(targets?.totalHousing),
        progress: past5YearsTotal,
      },
      {
        ...PROGRESS_CHART_DATA.intermediate,
        target: targets?.intermediateDelivery?.['2022'],
        progress: tenureCurrentYear?.['Intermediate'],
      },
      {
        ...PROGRESS_CHART_DATA.marketHousing,
        target: targets?.marketHousing?.['2022'],
        progress: tenureCurrentYear?.['Market for sale'],
      },
      {
        ...PROGRESS_CHART_DATA.socialRented,
        target: targets?.sociallyRented?.['2022'],
        progress: tenureCurrentYear?.['Social Rent'],
      },
    ],
    [past5YearsTotal, tenureCurrentYear, targets],
  );

  const formatCenterDisplay = ({ percentage, radius, width, target, name }) => {
    return !!percentage ? (
      <>
        <Text
          width={radius}
          textAnchor="middle"
          verticalAnchor="end"
          x={radius}
          y={radius}
          dy={-8}
          style={{
            fill: '#fff',
            fontSize: `${width / 150}rem`,
          }}
        >
          {`${Math.round(+percentage)}%`}
        </Text>
        <Text
          width={radius}
          textAnchor="middle"
          verticalAnchor="start"
          x={radius}
          y={radius}
          dy={8}
          style={{
            fill: '#fff',
            fontSize: `${width / 400}rem`,
          }}
        >
          {`Target ${target} Units`}
        </Text>
      </>
    ) : (
      <Text
        width={radius}
        textAnchor="middle"
        verticalAnchor="middle"
        x={radius}
        y={radius}
        style={{
          fill: '#fff',
          fontSize: `${width / 250}rem`,
        }}
      >
        {`${name} Target Required`}
      </Text>
    );
  };

  return (
    <>
      {!!targetData
        ? targetData.map((property, i) => (
            <ChartWrapper
              key={property.name}
              title={property.title}
              info={property.info}
              classes={{ header: styles.header }}
            >
              <ProgressIndicatorChart
                property={property}
                color={chartTheme.colors[i]}
                formatCenterDisplay={params =>
                  formatCenterDisplay({
                    ...params,
                    ...property,
                  })
                }
              />
            </ChartWrapper>
          ))
        : null}
    </>
  );
};

export { ProgressIndicators };
