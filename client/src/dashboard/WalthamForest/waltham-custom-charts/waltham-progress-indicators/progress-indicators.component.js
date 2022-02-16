import React, { useMemo } from 'react';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';
import { ProgressIndicatorChart } from 'dashboard/charts/progress-indicator-chart/progress-indicator-chart.component';
import { useChartTheme } from 'dashboard/useChartTheme';

import { getUser5YearTotals } from '../../utils';
import { LAST_5_YEARS, PROGRESS_CHART_DATA } from '../../waltham.constants';

const ProgressIndicators = ({ totalData, tenureData, userOrbState }) => {
  const chartTheme = useChartTheme();

  const totalDataArray = totalData?.properties?.[0]?.data;

  const tenureCurrentYear = tenureData?.properties?.[0]?.data?.find(
    obj => obj.Year === '2020-2021',
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
        ...PROGRESS_CHART_DATA.totalHousing,
        target: getUser5YearTotals(userOrbState?.totalHousing),
        progress: past5YearsTotal,
      },
      {
        ...PROGRESS_CHART_DATA.intermediate,
        target: userOrbState?.intermediateDelivery?.['2020-2021'],
        progress: tenureCurrentYear?.['Intermediate'],
      },
      {
        ...PROGRESS_CHART_DATA.marketHousing,
        target: userOrbState?.marketHousing?.['2020-2021'],
        progress: tenureCurrentYear?.['Market'],
      },
      {
        ...PROGRESS_CHART_DATA.socialRented,
        target: userOrbState?.sociallyRented?.['2020-2021'],
        progress: tenureCurrentYear?.['Social Rented'],
      },
    ],
    [past5YearsTotal, tenureCurrentYear, userOrbState],
  );

  return (
    <>
      {!!targetData
        ? targetData.map((property, i) => (
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
          ))
        : null}
    </>
  );
};

export { ProgressIndicators };
