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
import * as MOCK_DATA from '../mock-data/waltham-forest/mock_affordable_housing';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { groupedDataTransformer } from './utils';
import { AffordableHousingDelivery } from './waltham-custom-charts/waltham-affordable-housing-delivery/affordable-housing-delivery.component';
import { HousingApprovalsComponent } from './waltham-custom-charts/waltham-housing-approvals/housing-approvals.component';
import { WalthamHousingDelivery } from './waltham-custom-charts/waltham-housing-delivery/waltham-housing-delivery.component';
import { ProgressIndicators } from './waltham-custom-charts/waltham-progress-indicators/progress-indicators.component';
import ProgressionVsPlanningSchedule from './waltham-custom-charts/waltham-progression-of-units/progression-vs-planning-schedule.component';
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
  },
  progressIndicators: {
    display: 'flex',
    gap: '1rem',
  },
  planningProgression: {
    height: 'fit-content',
  },
  barCharts: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
  },
  progression: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  housingDelivery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}));

const WalthamForestDashboard = ({ sourceId }) => {
  const styles = useStyles({});
  const dispatch = useDispatch();

  const [targetDialogVisible, setTargetDialogVisible] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(undefined);

  const user = useSelector(userSelector),
    userOrbState = useSelector(userOrbStateSelector(sourceId));

  const existingTargets = userOrbState[selectedDataset];

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
    tenureHousingDeliveryChartData = useMemo(
      () => tenureHousingDelivery?.properties,
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

      <div className={styles.content}>
        {/* progress indicator charts */}
        <div className={styles.progressIndicators}>
          <ProgressIndicators
            totalData={totalHousingDelivery}
            tenureData={tenureHousingDeliveryChartData}
            userOrbState={userOrbState}
          />
        </div>

        <div className={styles.barCharts}>
          <div className={styles.progression}>
            <ProgressionVsPlanningSchedule data={progressionVsPlanning} />
            <AffordableHousingDelivery apiData={{ MOCK_DATA }} />
          </div>

          <div className={styles.housingDelivery}>
            {/* group/line and stack/line charts */}
            <WalthamHousingDelivery
              totalHousingDeliveryChartData={totalHousingDeliveryChartData}
              tenureHousingDeliveryChartData={tenureHousingDeliveryChartData}
              userOrbState={userOrbState}
            />
            {/* big multi-line chart */}
            <HousingApprovalsComponent
              x="Month"
              xLabel="Year"
              yLabel="No. Housing Approvals Granted"
              ranges={['2019', '2020']}
              data={approvalsGranted?.properties}
            />
          </div>
        </div>
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
              targets={existingTargets}
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
