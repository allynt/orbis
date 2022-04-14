import React, { useState } from 'react';

import { Button, makeStyles, Tab, Tabs } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { selectedAoiSelector } from 'data-layers/aoi/aoi.slice';

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
  tabbed: {
    display: 'flex',
  },
}));

const PANELS = {
  data: 'data',
  assessments: 'assessments',
};

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

  const selectedAoi = useSelector(selectedAoiSelector);
  const impactAssessment = useSelector(impactAssessmentSelector);

  const [assessmentDialogTab, setAssessmentDialogTab] = useState(0);
  const [visibleTab, setVisibleTab] = useState(PANELS.data);
  const [isAssessmentDialogVisible, setIsAssessmentDialogVisible] =
    useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const [initialFormState, setInitialFormState] = useState({
    startDate: null,
    endDate: null,
    activities: [],
    geometry: selectedAoi?.geometry,
  });

  const submitAssessment = form => {
    setInitialFormState(prev => ({ ...prev, ...form }));
    dispatch(fetchImpactAssessment(form));
    setAssessmentDialogTab(1);
  };

  const handleEditAssessment = id => {
    const assessment = ASSESSMENT_DATA.find(datum => datum.id === id);
    setSelectedAssessment(assessment);
  };

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
          onClick={() => setIsAssessmentDialogVisible(true)}
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
          data={ASSESSMENT_DATA}
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

      <AssessmentDialog
        visibleTab={assessmentDialogTab}
        results={selectedAssessment}
        onSubmit={() => console.log('Submitted!')}
        close={() => setSelectedAssessment(null)}
        open={!!selectedAssessment}
      />
    </div>
  );
};

export default NatureScotDashboard;
