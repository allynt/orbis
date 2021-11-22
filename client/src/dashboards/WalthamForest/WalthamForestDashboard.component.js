import React, { useEffect, useMemo } from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { widgetDataSelector, fetchWidgetData } from '../dashboards.slice';
import * as progressData from '../mock-data/waltham-forest/mock_target_progress';
import { useChartTheme } from '../useChartTheme';
import { ChartWrapper } from '../widgets/chart-wrapper.component';
import { GroupedBarChart } from '../widgets/grouped-bar-chart/grouped-bar-chart.component';
import { LineChart } from '../widgets/line-chart/line-chart.component';
import { ProgressIndicatorChart } from '../widgets/progress-indicator-chart/progress-indicator-chart.component';
import { StackedBarChart } from '../widgets/stacked-bar-chart/stacked-bar-chart.component';
import { groupedDataTransformer, lineDataTransformer } from './utils';

const useStyles = makeStyles(() => ({
  dashboard: {
    overflowY: 'scroll',
  },
  progressIndicators: {
    display: 'flex',
    padding: '2rem',
    gap: '1rem',
  },
  barCharts: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: '2rem',
    gap: '1rem',
  },
  lineCharts: {
    padding: '2rem',
  },
}));

const WalthamForestDashboard = ({ sourceId, widgets }) => {
  const styles = useStyles({});
  const chartTheme = useChartTheme();
  const dispatch = useDispatch();

  // all data, including 'name', 'version', etc
  const approvalsGranted = useSelector(
      widgetDataSelector(sourceId, 'ApprovalsGranted'),
    ),
    progressionVsPlanning = useSelector(
      widgetDataSelector(sourceId, 'ProgressionVsPlanning'),
    ),
    tenureHousingDelivery = useSelector(
      widgetDataSelector(sourceId, 'TenureHousingDelivery'),
    ),
    totalHousingDelivery = useSelector(
      widgetDataSelector(sourceId, 'TotalHousingDelivery'),
    );

  useEffect(() => {
    widgets.forEach(({ datasetName, url }) =>
      dispatch(fetchWidgetData(sourceId, datasetName, url)),
    );
  }, [sourceId, widgets, dispatch]);

  // only arrays of chart data, cached
  const totalHousingDeliveryChartData = useMemo(
      () => groupedDataTransformer(totalHousingDelivery?.properties[0].data),
      [totalHousingDelivery],
    ),
    approvalsGrantedChartData = useMemo(
      () => lineDataTransformer(approvalsGranted?.properties[0].data),
      [approvalsGranted],
    ),
    progressionVsPlanningChartData = useMemo(
      () => progressionVsPlanning?.properties[0].data,
      [progressionVsPlanning],
    ),
    tenureHousingDeliveryChartData = useMemo(
      () => tenureHousingDelivery?.properties[0].data,
      [tenureHousingDelivery],
    );

  return (
    <div className={styles.dashboard}>
      {/* PROGRESS INDICATOR CHARTS */}
      <div className={styles.progressIndicators}>
        {progressData.properties.map((property, i) => (
          <ChartWrapper
            key={property.name}
            title={property.title}
            info={property.info}
          >
            <ProgressIndicatorChart
              property={property}
              color={chartTheme.colors[i]}
            />
          </ChartWrapper>
        ))}
      </div>

      {/* STACKED AND GROUPED BAR CHARTS */}
      <div className={styles.barCharts}>
        <ChartWrapper
          title={progressionVsPlanning?.name}
          info={progressionVsPlanning?.name}
        >
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel={progressionVsPlanningChartData?.properties?.[0]?.name}
            data={progressionVsPlanningChartData}
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
          />
        </ChartWrapper>
        <ChartWrapper
          title={totalHousingDelivery?.name}
          info={totalHousingDelivery?.name}
        >
          <GroupedBarChart
            xLabel="Year"
            yLabel={totalHousingDelivery?.properties?.[0]?.name}
            data={totalHousingDeliveryChartData}
          />
        </ChartWrapper>
        <ChartWrapper
          title={tenureHousingDelivery?.name}
          info={tenureHousingDelivery?.name}
        >
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel={tenureHousingDeliveryChartData?.properties?.[0]?.name}
            data={tenureHousingDeliveryChartData}
            ranges={[
              'Affordable Rent',
              'Intermediate',
              'Market',
              'Social Rented',
              'Private Rented Sector',
            ]}
          />
        </ChartWrapper>
      </div>

      {/* LINE CHART */}
      <div className={styles.lineCharts}>
        <ChartWrapper
          title={approvalsGranted?.name}
          info={approvalsGranted?.name}
        >
          <LineChart
            data={approvalsGrantedChartData}
            x="Month"
            ranges={['2019', '2020', '2021']}
            xLabel="Year"
            yLabel="Data Property Name / Unit"
          />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default WalthamForestDashboard;
