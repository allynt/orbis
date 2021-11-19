import React, { useMemo } from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import * as lineData from '../mock-data/waltham-forest/mock_approvals_granted';
import * as stackedData from '../mock-data/waltham-forest/mock_progression_vs_planning_schedule';
import * as progressData from '../mock-data/waltham-forest/mock_target_progress';
import * as groupedData from '../mock-data/waltham-forest/mock_total_housing_delivery';
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

const WalthamForestDashboard = () => {
  const styles = useStyles({});
  const chartTheme = useChartTheme();

  const groupedChartData = useMemo(
      () => groupedDataTransformer(groupedData.properties[0].data),
      [],
    ),
    lineChartData = useMemo(
      () =>
        lineDataTransformer(
          lineData.properties.find(p => p.name === 'Monthly').data,
        ),
      [],
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
        <ChartWrapper title={stackedData.name} info={stackedData.name}>
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel={stackedData.properties[0].name}
            data={stackedData.properties[0].data}
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
          />
        </ChartWrapper>
        <ChartWrapper title={groupedData.name} info={groupedData.name}>
          <GroupedBarChart
            xLabel="Year"
            yLabel={groupedData.properties[0].name}
            data={groupedChartData}
          />
        </ChartWrapper>
      </div>

      {/* MULTIPLE LINE CHARTS */}
      <div className={styles.lineCharts}>
        <ChartWrapper title={lineData.name} info={lineData.name}>
          <LineChart
            data={lineChartData}
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
