import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { WFCGroupedDataTransformer } from '../data-transformers/utils';
import * as lineData from '../mock-data/waltham-forest/mock_approvals_granted';
import * as stackedData from '../mock-data/waltham-forest/mock_progression_vs_planning_schedule';
import * as progressData from '../mock-data/waltham-forest/mock_target_progress';
import * as groupedData from '../mock-data/waltham-forest/mock_total_housing_delivery';
import { useChartTheme } from '../useChartTheme';
import { GroupedBarChart } from '../widgets/grouped-bar-chart/grouped-bar-chart.component';
import { LineChart } from '../widgets/line-chart/line-chart.component';
import { ProgressIndicatorChart } from '../widgets/progress-indicator-chart/progress-indicator-chart.component';
import { StackedBarChart } from '../widgets/stacked-bar-chart/stacked-bar-chart.component';
import { Widget } from '../widgets/widget.component';

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

const TestDashboard = () => {
  const styles = useStyles({});
  const chartTheme = useChartTheme();
  return (
    <div className={styles.dashboard}>
      {/* PROGRESS INDICATOR CHARTS */}
      <div className={styles.progressIndicators}>
        {progressData.properties.map((property, i) => (
          <Widget
            key={property.name}
            title={property.title}
            info={property.info}
          >
            <ProgressIndicatorChart
              property={property}
              color={chartTheme.colors[i]}
            />
          </Widget>
        ))}
      </div>

      {/* STACKED AND GROUPED BAR CHARTS */}
      <div className={styles.barCharts}>
        <Widget title={stackedData.name} info={stackedData.name}>
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel={stackedData.properties[0].name}
            data={stackedData.properties[0].data}
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
          />
        </Widget>
        <Widget title={groupedData.name} info={groupedData.name}>
          <GroupedBarChart
            xLabel="Year"
            yLabel={groupedData.properties[0].name}
            data={WFCGroupedDataTransformer(groupedData.properties[0].data)}
          />
        </Widget>
      </div>

      {/* MULTIPLE LINE CHARTS */}
      <div className={styles.lineCharts}>
        <Widget title={lineData.name} info={lineData.name}>
          <LineChart
            data={lineData.properties.find(p => p.name === 'Monthly').data}
            x="Month"
            ranges={['2019', '2020']}
            xLabel="Year"
            yLabel="Data Property Name / Unit"
          />
        </Widget>
      </div>
    </div>
  );
};

export default TestDashboard;
