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

import { userSelector } from 'accounts/accounts.selectors';

import {
  chartDataSelector,
  fetchDashboardData,
  updateTargets,
  userOrbStateSelector,
} from '../dashboard.slice';
import { useChartTheme } from '../useChartTheme';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { groupedDataTransformer, lineDataTransformer } from './utils';
import { HousingApprovalsComponent } from './waltham-custom-charts/waltham-housing-approvals/housing-approvals.component';
import { WalthamHousingDelivery } from './waltham-custom-charts/waltham-housing-delivery/waltham-housing-delivery.component';
import { ProgressIndicators } from './waltham-custom-charts/waltham-progress-indicators/progress-indicators.component';
import { walthamApiMetadata, targetDatasets } from './waltham.constants';

const useStyles = makeStyles(theme => ({
  dashboard: {
    overflowY: 'scroll',
    width: '100%',
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

  const user = useSelector(userSelector),
    userOrbState = useSelector(userOrbStateSelector(sourceId));

  // all data, including 'name', 'version', etc
  const targetProgress = useSelector(
      chartDataSelector(sourceId, 'TargetProgress'),
    ),
    approvalsGranted = useSelector(
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
      // @ts-ignore
      dispatch(fetchDashboardData({ sourceId, datasetName, url })),
    );
  }, [sourceId, dispatch]);

  const closeDialog = () => {
    setSelectedDataset(undefined);
    setTargetDialogVisible(false);
  };

  /**
   * @param {object} targets
   */
  const handleAddTargetsClick = targets => {
    dispatch(updateTargets({ sourceId, targets, user }));
    closeDialog();
  };

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
        <ProgressIndicators
          data={totalHousingDelivery}
          userOrbState={userOrbState}
        />
      </div>

      {/* stacked/grouped bar charts */}
      <div className={styles.barCharts}>
        {/* <ChartWrapper
          title="Progression of Units Relating to Planning Schedule"
          info="This is a test description"
        >
          <StackedBarChart
            x="Year"
            ranges={['Ahead of Schedule', 'Behind Schedule', 'On Track']}
            data={progressionVsPlanningChartData}
          />
        </ChartWrapper> */}

        {/* group/line and stack/line charts */}
        <WalthamHousingDelivery
          totalHousingDeliveryChartData={totalHousingDeliveryChartData}
          tenureHousingDeliveryChartData={tenureHousingDeliveryChartData}
          userOrbState={userOrbState}
        />
      </div>

      {/* big multi-line chart */}
      <div className={styles.lineCharts}>
        <HousingApprovalsComponent
          x="Month"
          xLabel="Year"
          yLabel="No. Housing Approvals Granted"
          ranges={['2019', '2020', '2021']}
          data={approvalsGrantedChartData}
        />
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
