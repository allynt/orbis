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

const activities = [
  { title: 'Graze more sheep', code: 'grazingSheepMore' },
  { title: 'Graze less sheep', code: 'grazingSheepMore' },
];

const ASSESSMENT_DATA = [
  {
    id: 1,
    description: 'Construct campsite',
    startDate: '2023-01-01T00:00:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:00:00.000Z',
    version: '1st',
    activities,
  },
  {
    id: 2,
    description: 'Raise Building',
    startDate: '2023-01-01T00:42:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:42:00.000Z',
    version: '2nd',
    activities,
  },
  {
    id: 3,
    description: 'Some Building',
    startDate: '2023-01-01T00:00:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:00:00.000Z',
    version: '1st',
    activities,
  },
  {
    id: 4,
    description: 'Another Building',
    startDate: '2023-01-01T00:42:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:42:00.000Z',
    version: '2nd',
    activities,
  },
  {
    id: 5,
    description: 'Shopping Mall',
    startDate: '2023-01-01T00:00:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:00:00.000Z',
    version: '1st',
    activities,
  },
  {
    id: 6,
    description: 'Hospital',
    startDate: '2023-01-01T00:42:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:42:00.000Z',
    version: '2nd',
    activities,
  },
  {
    id: 7,
    description: 'Skateboard Park',
    startDate: '2023-01-01T00:00:00.000Z',
    endDate: '2023-02-03T00:00:00.000Z',
    time: '2023-01-01T00:00:00.000Z',
    version: '1st',
    activities,
  },
  {
    id: 8,
    description: 'Old Folks Home',
    startDate: '2000-01-01T00:42:00.000Z',
    endDate: '2000-02-03T00:00:00.000Z',
    time: '2000-01-01T00:42:00.000Z',
    version: '2nd',
    activities,
  },
  {
    id: 9,
    description: 'Easter Road',
    startDate: '2000-01-01T00:00:00.000Z',
    endDate: '2000-02-03T00:00:00.000Z',
    time: '2000-01-01T00:00:00.000Z',
    version: '1st',
    activities,
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
    const assessment = ASSESSMENT_DATA.find(datum => datum.id === id);
    const { description, startDate, endDate, activities } = assessment;
    setInitialFormState(prev => ({
      ...prev,
      description,
      startDate,
      endDate,
      activities,
    }));
    setIsAssessmentDialogVisible(true);
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
    </div>
  );
};

export default NatureScotDashboard;
