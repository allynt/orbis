import React, { useEffect, useMemo } from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { widgetDataSelector, getWidgetData } from '../dashboards.slice';
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

// const useWidgets = (sourceId, widget) => {
//   const { componentName, props } = widget;

//   const widgetData = useSelector(widgetDataSelector(sourceId, componentName));

//   const Widget = React.lazy(() =>
//     import(`../widgets/${componentName}.component`),
//   );

//   / REST OF PROPS MUST BE HERE TOO, LABELS, RANGE ETC!!!
//   return <Widget data={widgetData} {...props} />;
// };

const WalthamForestDashboard = ({ sourceId, widgets }) => {
  const styles = useStyles({});
  const chartTheme = useChartTheme();

  const lineData = useSelector(widgetDataSelector(sourceId, 'line-chart'));
  const stackedData = useSelector(
    widgetDataSelector(sourceId, 'stacked-bar-chart'),
  );
  const groupedData = useSelector(
    widgetDataSelector(sourceId, 'grouped-chart'),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    widgets.forEach(({ component, url }) => {
      dispatch(getWidgetData(sourceId, component, url));
    });
  }, [sourceId, widgets, dispatch]);

  // useEffect(() => {
  //   const result = widgets?.map(widget => useWidgets(sourceId, widget));
  // }, [sourceId, widgets]);

  const groupedChartData = useMemo(
      () => groupedDataTransformer(groupedData?.properties[0].data),
      [groupedData],
    ),
    lineChartData = useMemo(
      () => lineDataTransformer(lineData?.properties[0].data),
      [lineData],
    ),
    stackedGroupData = useMemo(() => stackedData?.properties[0].data, [
      stackedData,
    ]);

  console.log('lineChartData: ', lineChartData);
  console.log('stackedGroupData: ', stackedGroupData);
  console.log('groupedChartData: ', groupedChartData);

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
        <ChartWrapper title={stackedData?.name} info={stackedData?.name}>
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel={stackedGroupData}
            data={stackedGroupData}
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
          />
        </ChartWrapper>
        <ChartWrapper title={groupedData?.name} info={groupedData?.name}>
          <GroupedBarChart
            xLabel="Year"
            yLabel={groupedData}
            data={groupedChartData}
          />
        </ChartWrapper>
      </div>

      {/* MULTIPLE LINE CHARTS */}
      <div className={styles.lineCharts}>
        <ChartWrapper title={lineData?.name} info={lineData?.name}>
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
