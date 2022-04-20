import React, { useEffect, useState } from 'react';

import { Button, makeStyles, Tab, Tabs } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { selectedAoiSelector } from 'data-layers/aoi/aoi.slice';

import AssessmentTable from './assessments/assessments-table.component';
import Charts from './charts/charts.component';
import AssessmentDialog from './dialog/assessment-dialog.component';
import {
  fetchImpactAssessment,
  fetchProposals,
  impactAssessmentSelector,
  proposalsSelector,
} from './nature-scot.slice';

const useStyles = makeStyles(theme => ({
  subRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dashboard: {
    justifyContent: 'space-between',
    padding: '2rem',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    overflowY: 'scroll',
    gap: '1rem',
  },
  item: {
    width: 'calc(50% - 1rem)',
  },
  wrapper: {
    width: '100%',
  },
  tab: {},
  assessmentButton: {
    marginLeft: 'auto',
    marginRight: '2rem',
  },
  tabbed: {
    display: 'flex',
  },
}));

const PANELS = {
  data: 'data',
  assessments: 'assessments',
};

const NatureScotDashboard = ({ sourceId }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedAoi = useSelector(selectedAoiSelector);
  const impactAssessment = useSelector(impactAssessmentSelector);
  const proposals = useSelector(proposalsSelector);

  const [assessmentDialogTab, setAssessmentDialogTab] = useState(0);
  const [visibleTab, setVisibleTab] = useState(PANELS.data);
  const [isAssessmentDialogVisible, setIsAssessmentDialogVisible] =
    useState(false);

  const initialState = {
    description: '',
    startDate: null,
    endDate: null,
    activities: [],
    geometry: selectedAoi?.geometry,
  };

  const [initialFormState, setInitialFormState] = useState(initialState);

  const submitAssessment = form => {
    setInitialFormState(prev => ({ ...prev, ...form }));
    dispatch(fetchImpactAssessment(form));
    setAssessmentDialogTab(1);
  };

  const handleEditAssessment = id => {
    const assessment = proposals.find(proposal => proposal.id === id);

    setInitialFormState(prev => ({
      ...prev,
      description: assessment.proposal_description,
      startDate: assessment.proposal_start_date,
      endDate: assessment.proposal_end_date,
      activities: assessment.proposal_activities,
    }));
    setIsAssessmentDialogVisible(true);
  };

  useEffect(() => dispatch(fetchProposals()), [dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabbed}>
        <Tabs
          variant="standard"
          scrollButtons="on"
          value={visibleTab}
          onChange={(_event, value) => setVisibleTab(value)}
        >
          <Tab className={styles.tab} label="Dashboard" value={PANELS.data} />
          <Tab
            className={styles.tab}
            label="Assessments"
            value={PANELS.assessments}
          />
        </Tabs>

        <Button
          onClick={() => {
            setInitialFormState(initialState);
            setIsAssessmentDialogVisible(true);
          }}
          className={styles.assessmentButton}
          color="secondary"
        >
          Start Impact Assessment
        </Button>
      </div>
      {visibleTab === PANELS.data && (
        <Charts sourceId={sourceId} selectedAoi={selectedAoi} />
      )}
      {visibleTab === PANELS.assessments && (
        <AssessmentTable
          data={proposals}
          handleEditAssessment={handleEditAssessment}
        />
      )}

      <AssessmentDialog
        visibleTab={assessmentDialogTab}
        results={impactAssessment}
        onSubmit={submitAssessment}
        close={() => setIsAssessmentDialogVisible(false)}
        open={isAssessmentDialogVisible}
        initialFormState={initialFormState}
      />
    </div>
  );
};

export default NatureScotDashboard;
