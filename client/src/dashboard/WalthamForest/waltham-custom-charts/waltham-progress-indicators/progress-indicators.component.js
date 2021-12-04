import React, { useMemo } from 'react';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

const ProgressIndicators = ({ data, userOrbState }) => {
  const chartTheme = useChartTheme();

  const last5Years = [
    '2016-2017',
    '2017-2018',
    '2018-2019',
    '2019-2020',
    '2020-2021',
  ];

  const userTotals = obj =>
    obj ? Object.values(obj).reduce((a, c) => (a += +c), 0) : undefined;

  const dataArray = data?.properties?.[0]?.data;

  // 'Gross' values tallied up for last 5 years, like ticket asks
  const past5YearsTotal = useMemo(
      () =>
        last5Years.reduce(
          (acc, cur) =>
            (acc += +dataArray?.find(d => d.Year === cur)?.['Total Gross']),
          0,
        ),
      [dataArray, last5Years],
    ),
    currentYearTotal = dataArray?.find(a => a.Year === '2020-2021')?.[
      'Total Gross'
    ];

  // data combined with user target for progress wheels
  const targetData = [
    {
      title:
        '% of Houses Delivered So Far out of Previous 5 Financial Years Target.',
      info: 'Some info',
      name: 'Housing Delivery',
      target: useMemo(() => userTotals(userOrbState?.totalHousing), [
        userOrbState,
      ]),
      progress: past5YearsTotal,
    },
    {
      title:
        '% Intermediate Houses Delivered so Far Out of Current Financial Year.',
      info: 'Some info',
      name: 'Intermediate Delivery',
      target: userOrbState?.intermediateDelivery?.['2020-2021'],
      progress: currentYearTotal,
    },
    {
      title: '% Market Houses Delivered so Far Out of Current Financial Year',
      info: 'Some info',
      name: 'Market Housing',
      target: userOrbState?.marketHousing?.['2020-2021'],
      progress: currentYearTotal,
    },
    {
      title: '% Social Rented Houses Delivered so Far Out of Yearly Target',
      info: 'Some info',
      name: 'Socially Rented',
      target: userOrbState?.sociallyRented?.['2020-2021'],
      progress: currentYearTotal,
    },
  ];

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
