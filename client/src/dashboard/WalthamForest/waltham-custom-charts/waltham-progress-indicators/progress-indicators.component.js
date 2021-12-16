import React, { useMemo } from 'react';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { getUser5YearTotals } from '../../utils';
import { LAST_5_YEARS } from '../../waltham.constants';

const ProgressIndicators = ({ totalData, tenureData, userOrbState }) => {
  const chartTheme = useChartTheme();

  const totalDataArray = totalData?.properties?.[0]?.data,
    tenureCurrentYear = tenureData?.[0]?.data?.find(
      d => d.Year === '2020-2021',
    );

  // 'Gross' values tallied up for last 5 years, like ticket asks
  const past5YearsTotal = useMemo(
    () =>
      LAST_5_YEARS.reduce(
        (acc, cur) =>
          (acc += +totalDataArray?.find(d => d.Year === cur)?.['Total Gross']),
        0,
      ),
    [totalDataArray],
  );

  // data combined with user target for progress wheels
  const targetData = useMemo(
    () => [
      {
        title:
          '% of Houses Delivered So Far out of Previous 5 Financial Years Target.',
        info: 'Some info',
        name: 'Housing Delivery',
        target: getUser5YearTotals(userOrbState?.totalHousing),
        progress: past5YearsTotal,
      },
      {
        title:
          '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
        info: 'Some info',
        name: 'Intermediate Delivery',
        target: userOrbState?.intermediateDelivery?.['2020-2021'],
        progress: tenureCurrentYear?.['Intermediate'],
      },
      {
        title: '% Market Houses Delivered so Far Out of Current Financial Year',
        info: 'Some info',
        name: 'Market Housing',
        target: userOrbState?.marketHousing?.['2020-2021'],
        progress: tenureCurrentYear?.['Market'],
      },
      {
        title: '% Social Rented Houses Delivered so Far Out of Yearly Target',
        info: 'Some info',
        name: 'Socially Rented',
        target: userOrbState?.sociallyRented?.['2020-2021'],
        progress: tenureCurrentYear?.['Social Rented'],
      },
    ],
    [past5YearsTotal, tenureCurrentYear, userOrbState],
  );

  return (
    <>
      {targetData?.map((property, i) => (
        <ChartWrapper
          key={property.name}
          title={property.title}
          info="This is a test description"
        >
          <ProgressIndicatorChart
            property={property}
            color={chartTheme.colors[i]}
          />
        </ChartWrapper>
      ))}
    </>
  );
};

export { ProgressIndicators };
