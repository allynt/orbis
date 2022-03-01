import React, { useEffect, useState, useRef } from 'react';

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
  updateUserDashboardConfig,
  userOrbStateSelector,
} from '../dashboard.slice';
import {
  SelectScreen,
  TargetScreen,
} from './target-dialog-screens/target-dialog-screens';
import { AffordableHousingDelivery } from './waltham-custom-charts/waltham-affordable-housing-delivery/affordable-housing-delivery.component';
import DeliverableSupplySummary from './waltham-custom-charts/waltham-deliverable-supply-summary/deliverable-supply-summary.component';
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
    ),
    affordableHousingDelivery = useSelector(
      chartDataSelector(sourceId, 'AffordableHousingDelivery'),
    );

  const user = useSelector(userSelector);
  const userOrbState = useSelector(userOrbStateSelector(sourceId));

  const { targets, settings } = userOrbState;

  const [dashboardSettings, setDashboardSettings] = useState({
    targets: {},
    settings: {},
  });
  const [selectedDataset, setSelectedDataset] = useState(undefined);
  const [localTargets, setLocalTargets] = useState(targets);
  const [targetDialogVisible, setTargetDialogVisible] = useState(false);

  const dashboardSettingsRef = useRef(dashboardSettings);

  /**
   * @param {object} data
   */
  const updateWalthamOrbState = data =>
    dispatch(updateUserDashboardConfig({ user, sourceId, data }));

  useEffect(() => {
    walthamApiMetadata.forEach(({ datasetName, url }) =>
      // @ts-ignore
      dispatch(fetchDashboardData({ sourceId, datasetName, url })),
    );
  }, [sourceId, dispatch]);

  // 1. listener func must be reusable so that it can also be removed
  // 2. must check changes have been made to prevent firing every time
  const saveSettingsHandler = () => {
    const changesMade = Object.values(dashboardSettingsRef.current).some(
      obj => !!Object.keys(obj).length,
    );

    return changesMade
      ? updateWalthamOrbState(dashboardSettingsRef.current)
      : null;
  };

  // update dashboardSettingsRef to be used in saving dashboard settings every
  // time dashboardSettings is updated
  useEffect(() => {
    dashboardSettingsRef.current = dashboardSettings;
  }, [dashboardSettings]);

  // add event listener in the event that the user closes/refreshes tab
  useEffect(() => {
    window.addEventListener('beforeunload', saveSettingsHandler);
  });

  // if user navigates away in-app, remove listener and save settings
  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', saveSettingsHandler);
      saveSettingsHandler();
    };
  }, []);

  const closeDialog = () => {
    setSelectedDataset(undefined);
    setTargetDialogVisible(false);
  };

  /**
   * @param {object} newTargets
   */
  const handleAddTargetsClick = newTargets => {
    setLocalTargets(prev => ({ ...prev, ...newTargets }));
    setDashboardSettings(prev => ({
      ...prev,
      targets: { ...prev.targets, ...newTargets },
    }));
    closeDialog();
  };

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
            tenureData={tenureHousingDelivery}
            targets={localTargets}
          />
        </div>

        <div className={styles.barCharts}>
          <div className={styles.progression}>
            <ProgressionVsPlanningSchedule
              data={progressionVsPlanning}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
            <AffordableHousingDelivery data={affordableHousingDelivery} />
          </div>
          <div className={styles.housingDelivery}>
            {/* group/line and stack/line charts */}
            <WalthamHousingDelivery
              totalHousingDeliveryChartData={
                totalHousingDelivery?.properties[0].data
              }
              tenureHousingDeliveryChartData={tenureHousingDelivery?.properties}
              targets={localTargets}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
            />
            {/* big multi-line chart */}
            <HousingApprovalsComponent
              x="Month"
              xLabel="Year"
              yLabel="No. Housing Approvals Granted"
              ranges={['2019', '2020']}
              data={approvalsGranted?.properties}
              settings={settings}
              setDashboardSettings={setDashboardSettings}
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
              onAddTargetsClick={targets => handleAddTargetsClick(targets)}
              selectedDataset={selectedDataset}
              targets={localTargets[selectedDataset]}
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
