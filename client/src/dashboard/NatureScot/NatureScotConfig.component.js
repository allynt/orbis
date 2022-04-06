import React, { useState } from 'react';

import { Button, makeStyles, Tab, Tabs } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import AssessmentTable from './assessments/assessments-table.component';
import Charts from './charts/charts.component';
import AssessmentDialog from './dialog/assessment-dialog.component';
import {
  fetchImpactAssessment,
  impactAssessmentSelector,
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
}));

const PANELS = {
  data: 'data',
  assessments: 'assessments',
};

// const ASSESSMENT_DATA = [];
const ASSESSMENT_DATA = [
  {
    id: 1,
    name: 'Construct campsite',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
  {
    id: 2,
    name: 'Raise Building',
    date: '2000-01-01T00:42:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
  },
  {
    id: 3,
    name: 'Some Building',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
  {
    id: 4,
    name: 'Another Building',
    date: '2000-01-01T00:42:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
  },
  {
    id: 5,
    name: 'Shopping Mall',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
  {
    id: 6,
    name: 'Hospital',
    date: '2000-01-01T00:42:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
  },
  {
    id: 7,
    name: 'Skateboard Park',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
  {
    id: 8,
    name: 'Old Folks Home',
    date: '2000-01-01T00:42:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
  },
  {
    id: 9,
    name: 'Easter Road',
    date: '2000-01-01T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
  },
];

const NatureScotDashboard = ({ sourceId }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [assessmentDialogTab, setAssessmentDialogTab] = useState(0);
  const [visibleTab, setVisibleTab] = useState(PANELS.data);
  const [isAssessmentDialogVisible, setIsAssessmentDialogVisible] =
    useState(false);

  const impactAssessment = useSelector(impactAssessmentSelector);

  const submitAssessment = form => {
    dispatch(fetchImpactAssessment(form));
    setAssessmentDialogTab(1);
  };

  return (
    <div className={styles.wrapper}>
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
        <Button
          onClick={() => setIsAssessmentDialogVisible(true)}
          className={styles.assessmentButton}
          color="secondary"
        >
          Start Impact Assessment
        </Button>
      </Tabs>

      {visibleTab === PANELS.data && <Charts sourceId={sourceId} />}
      {visibleTab === PANELS.assessments && (
        <AssessmentTable data={ASSESSMENT_DATA} />
      )}

      <AssessmentDialog
        visibleTab={assessmentDialogTab}
        results={impactAssessment}
        onSubmit={submitAssessment}
        close={() => setIsAssessmentDialogVisible(false)}
        open={isAssessmentDialogVisible}
      />
    </div>
  );
};

export default NatureScotDashboard;
