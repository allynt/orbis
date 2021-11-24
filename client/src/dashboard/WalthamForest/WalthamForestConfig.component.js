import React, { useEffect, useMemo, useState } from 'react';

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { ChartWrapper } from '../charts/chart-wrapper.component';
import { GroupedBarChart } from '../charts/grouped-bar-chart/grouped-bar-chart.component';
import { LineChart } from '../charts/line-chart/line-chart.component';
import { ProgressIndicatorChart } from '../charts/progress-indicator-chart/progress-indicator-chart.component';
import { StackedBarChart } from '../charts/stacked-bar-chart/stacked-bar-chart.component';
import {
  chartDataSelector,
  fetchChartData,
  updateTargets,
  userTargetSelector,
} from '../dashboard.slice';
import * as progressData from '../mock-data/waltham-forest/mock_target_progress';
import { useChartTheme } from '../useChartTheme';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { groupedDataTransformer, lineDataTransformer } from './utils';
import { walthamApiMetadata, targetDatasets } from './waltham.constants';

const useStyles = makeStyles(theme => ({
  dashboard: {
    overflowY: 'scroll',
  },
  header: {
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
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

const WalthamForestDashboard = ({ sourceId }) => {
  const styles = useStyles({});
  const chartTheme = useChartTheme();
  const dispatch = useDispatch();

  const [targetDialogVisible, setTargetDialogVisible] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(undefined);

  const closeDialog = () => {
    setSelectedDataset(undefined);
    setTargetDialogVisible(false);
  };

  /**
   * @param {object} targets
   */
  const handleAddTargetsClick = targets => {
    dispatch(updateTargets(sourceId, targets));
    closeDialog();
  };

  const userOrbState = useSelector(
    userTargetSelector(sourceId, 'totalHousing'),
  );

  const progressChartData = progressData.properties.map(p => ({
    ...p,
    ...userOrbState,
  }));

  // all data, including 'name', 'version', etc
  const approvalsGranted = useSelector(
      chartDataSelector(sourceId, 'ApprovalsGranted'),
    ),
    progressionVsPlanning = useSelector(
      chartDataSelector(sourceId, 'ProgressionVsPlanning'),
    ),
    tenureHousingDelivery = useSelector(
      chartDataSelector(sourceId, 'TenureHousingDelivery'),
    ),
    totalHousingDelivery = useSelector(
      chartDataSelector(sourceId, 'TotalHousingDelivery'),
    );

  useEffect(() => {
    walthamApiMetadata.forEach(({ datasetName, url }) =>
      dispatch(fetchChartData(sourceId, datasetName, url)),
    );
  }, [sourceId, dispatch]);

  // only arrays of chart data, transformed where needed and cached
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

  // selectors for target data go here, to be used in wheels
  // and in layered line charts

  return (
    <div className={styles.dashboard}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <Typography variant="h2">IMO / PO Dashboard</Typography>
        <Button size="small" onClick={() => setTargetDialogVisible(true)}>
          Add Targets
        </Button>
      </Grid>

      {/* progress indicator charts */}
      <div className={styles.progressIndicators}>
        {progressData.properties.map((property, i) => (
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
      </div>

      {/* stacked/grouped bar charts */}
      <div className={styles.barCharts}>
        <ChartWrapper
          title="Progression of Units Relating to Planning Schedule"
          info="This is a test description"
        >
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel="Number of Units"
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
            data={progressionVsPlanningChartData}
          />
        </ChartWrapper>
        <ChartWrapper
          title="Total Housing Delivery 2016-2021"
          info="This is a test description"
        >
          <GroupedBarChart
            xLabel="Year"
            yLabel="Housing Delivery in Units"
            data={totalHousingDeliveryChartData}
          />
        </ChartWrapper>
        <ChartWrapper
          title="Housing Delivery by Tenure Type 2016-2021"
          info="This is a test description"
        >
          <StackedBarChart
            x="Year"
            xLabel="Financial Year"
            yLabel="Housing Delivery in Units"
            ranges={[
              'Affordable Rent',
              'Intermediate',
              'Market',
              'Social Rented',
              'Private Rented Sector',
            ]}
            data={tenureHousingDeliveryChartData}
          />
        </ChartWrapper>
      </div>

      {/* line chart */}
      <div className={styles.lineCharts}>
        <ChartWrapper
          title="No. of Housing Approvals Granted Over Time"
          info="This is a test description"
        >
          <LineChart
            x="Month"
            xLabel="Year"
            yLabel="Data Property Name / Unit"
            ranges={['2019', '2020', '2021']}
            data={approvalsGrantedChartData}
          />
        </ChartWrapper>
      </div>

      <Dialog
        maxWidth="md"
        open={targetDialogVisible}
        onClose={closeDialog}
        aria-labelledby="waltham-forest-targets-dialog"
      >
        <DialogTitle onClose={closeDialog}>
          {targetDatasets[selectedDataset] ?? 'Add Targets'}
        </DialogTitle>
        <DialogContent>
          {!!selectedDataset ? (
            <TargetScreen
              onAddTargetsClick={targets =>
                handleAddTargetsClick({ [selectedDataset]: targets })
              }
            />
          ) : (
            <SelectScreen
              onNextClick={dataset => setSelectedDataset(dataset)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalthamForestDashboard;
