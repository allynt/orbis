import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { format } from 'date-fns';

import {
  ImpactSummary,
  ImpactSummarySkeleton,
} from '../charts/impact-summary/impact-summary.component';
import AssessmentActivityImpacts, {
  AssessmentActivityImpactsSkeleton,
} from './assessment-activity-impacts';
import ImpactFeatureDetails from './impact-feature-details.component';
import ProtectedAreasList, {
  ProtectedAreasListSkeleton,
} from './protected-areas-list.component';
import SaveProposalForm from './save-proposal-form.component';

const useStyles = makeStyles(theme => ({
  dialogTitle: { position: 'relative' },
  buttons: {
    '& > *': {
      margin: '1rem',
    },
  },
  reportGenerated: {
    padding: '1rem',
  },
}));

const FORMATS = {
  PDF: 'PDF',
  CSV: 'CSV',
};

const AssessmentResults = ({
  results,
  formState,
  updateAssessment,
  saveAssessment,
}) => {
  const styles = useStyles();
  const now = formState.reportGenerated
    ? new Date(formState.reportGenerated)
    : new Date();

  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [saveProposalFormOpen, setSaveProposalFormOpen] = useState(false);

  const exportAs = type =>
    console.log('Export: ', selectedAssessments, ' as: ', type);

  const saveAssessmentAndCloseDialog = form => {
    saveAssessment(form);
    setSaveProposalFormOpen(false);
  };

  const saveOrUpdateAssessment = form =>
    !formState.id ? setSaveProposalFormOpen(true) : updateAssessment(form);

  return (
    <>
      <Typography variant="h4" className={styles.reportGenerated}>
        Report generated at: {format(now, 'PPPPpp')}
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={6}>
          {!results ? (
            <ImpactSummarySkeleton />
          ) : (
            <ImpactSummary data={results?.summary} />
          )}
        </Grid>
        <Grid container item xs={6}>
          {!results ? (
            <ProtectedAreasListSkeleton />
          ) : (
            <ProtectedAreasList areas={results?.areas} />
          )}
        </Grid>
        <Grid container item xs={12}>
          {!results ? (
            <AssessmentActivityImpactsSkeleton />
          ) : (
            <AssessmentActivityImpacts data={results?.activities} />
          )}
        </Grid>
        <Grid container item xs={6}></Grid>
        <Grid container item xs={6}>
          {!results ? (
            <AssessmentActivityImpactsSkeleton />
          ) : (
            <ImpactFeatureDetails data={results?.impacts_by_feature} />
          )}
        </Grid>

        <Grid className={styles.buttons} container item xs={6}>
          <Button onClick={() => exportAs(FORMATS.PDF)} size="small">
            Export as PDF
          </Button>
          <Button onClick={() => exportAs(FORMATS.CSV)} size="small">
            Export as CSV
          </Button>
          <Button
            onClick={() => saveOrUpdateAssessment(formState)}
            size="small"
          >
            {!formState.id ? 'Save' : 'Update'}
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={saveProposalFormOpen}
        onClose={() => setSaveProposalFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          className={styles.dialogTitle}
          onClose={() => setSaveProposalFormOpen(false)}
        >
          Name Your Assessment
        </DialogTitle>
        <DialogContent>
          <SaveProposalForm onSubmit={saveAssessmentAndCloseDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentResults;
