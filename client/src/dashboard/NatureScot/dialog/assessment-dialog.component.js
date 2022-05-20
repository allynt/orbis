import React, { useEffect, useState } from 'react';

import {
  Button,
  CloseIcon,
  Dialog,
  IconButton,
  Tab,
  Tabs,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { TabPanel } from 'dashboard/NatureScot/tab-panel';

import AssessmentResults from '../assessments/assessment-results.component';
import YesNoDialog from '../assessments/yes-no-dialog.component';
import {
  saveProposal,
  updateProposal,
  impactActivitiesSelector,
  fetchImpactActivities,
} from '../nature-scot.slice';
import AssessmentDialogForm from './assessment-dialog-form';
const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: 20,
  },
  overviewHighlightedText: {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  overviewText: {
    fontSize: '1rem',
  },
  heading: {
    padding: '4rem',
  },
  buttons: {
    display: 'flex',
    width: '80%',
    justifyContent: 'space-evenly',
    padding: '0 0 2rem 0',
  },
}));

/**
 * @param {{
 * visibleTab: number,
 * open: boolean,
 * close: function,
 * onSubmit: function,
 * impactAssessment: object,
 * formState?: object
 * }} props
 */
const AssessmentDialog = ({
  visibleTab,
  open = false,
  close,
  onSubmit,
  impactAssessment,
  formState,
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  // TODO: this is breaking save, what was it before?
  const [reportGeneratedTimestamp, setReportGeneratedTimestamp] = useState(
    !!formState.reportGenerated ? new Date(formState.reportGenerated) : null,
  );

  /** @param {object} form */
  const updateAssessment = form => {
    dispatch(
      // @ts-ignore
      updateProposal({
        ...form,
        geometry: form.geometry,
        proposal_description: form.description,
        proposal_start_date: form.startDate,
        proposal_end_date: form.endDate,
        proposal_activities: form.activities,
        report_generated: form.reportGenerated,
        report_state: form.impactAssessment,
      }),
    );
  };

  /** @param {object} form */
  const saveAssessment = form => {
    dispatch(
      // @ts-ignore
      saveProposal({
        ...form,
        geometry: formState.geometry,
        proposal_description: formState.description,
        proposal_start_date: formState.startDate,
        proposal_end_date: formState.endDate,
        proposal_activities: formState.activities,
        report_generated: form.reportGenerated,
        report_state: form.impactAssessment,
      }),
    );
  };

  const activities = useSelector(impactActivitiesSelector);
  useEffect(() => {
    dispatch(fetchImpactActivities());
  }, [dispatch]);

  const [tab, setTab] = useState(visibleTab);
  const [yesNoDialogVisible, setYesNoDialogVisible] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);

  const toggleTab = (event, tab) => setTab(tab);

  const handleClose = () =>
    formIsDirty ? setYesNoDialogVisible(true) : close();

  const handleYesNo = status => {
    if (status) {
      setYesNoDialogVisible(false);
      close();
    } else {
      setYesNoDialogVisible(false);
    }
  };

  const handleSubmit = form => {
    onSubmit(form);
    setTab(1);
  };

  useEffect(() => setTab(visibleTab), [visibleTab, setTab]);

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <IconButton
        size="small"
        aria-label="impact-dialog-close-icon"
        className={styles.closeButton}
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>

      <div className={styles.content}>
        <h3>Welcome to the Impact Assessment functionality for Eco-an-Alba.</h3>

        <Tabs value={tab} onChange={toggleTab}>
          <Tab label="Form" />
          <Tab label="Results" disabled={!impactAssessment} />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <p className={styles.overviewText}>
            This feature will show you the impacts of a proposed change or
            development within your area of interest.
            <span className={styles.overviewHighlightedText}>
              Please note, it does not replace the consent or consultation
              processes.
            </span>
            Applications should continue to be made to NatureScot.
          </p>
          <AssessmentDialogForm
            onSubmit={handleSubmit}
            formState={formState}
            setFormIsDirty={setFormIsDirty}
            activities={activities}
            setReportGeneratedTimestamp={setReportGeneratedTimestamp}
          />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <AssessmentResults
            impactAssessment={impactAssessment}
            formState={formState}
            updateAssessment={updateAssessment}
            saveAssessment={saveAssessment}
            reportGeneratedTimestamp={reportGeneratedTimestamp}
          />
        </TabPanel>
      </div>

      {yesNoDialogVisible && formIsDirty ? (
        <YesNoDialog
          isOpen={yesNoDialogVisible}
          close={() => setYesNoDialogVisible(false)}
        >
          <h3 className={styles.heading}>
            Are you sure you want to leave this page?
          </h3>

          <div className={styles.buttons}>
            <Button onClick={() => handleYesNo(true)} size="small">
              Yes
            </Button>
            <Button onClick={() => handleYesNo(false)} size="small">
              No
            </Button>
          </div>
        </YesNoDialog>
      ) : null}
    </Dialog>
  );
};

export default AssessmentDialog;
