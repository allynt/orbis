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
import { useDispatch } from 'react-redux';

import { ImpactSummary } from '../charts/impact-summary/impact-summary.component';
import { saveProposal } from '../nature-scot.slice';
import AssessmentActivityImpacts from './assessment-activity-impacts';
import ImpactFeatureDetails from './impact-feature-details.component';
import ProtectedAreasList from './protected-areas-list.component';
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

const AssessmentResults = ({ results, formState }) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const now = formState.reportGenerated
    ? new Date(formState.reportGenerated)
    : new Date();

  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [saveProposalFormOpen, setSaveProposalFormOpen] = useState(false);

  const exportAs = type =>
    console.log('Export: ', selectedAssessments, ' as: ', type);

  const saveAssessment = form =>
    dispatch(
      // @ts-ignore
      saveProposal({
        ...form,
        geometry: formState.geometry,
        proposal_description: formState.description,
        proposal_start_date: formState.startDate,
        proposal_end_date: formState.endDate,
        proposal_activities: formState.activities,
        report_generated: now.toISOString(),
        report_state: results,
      }),
    );

  return (
    <>
      <Typography variant="h4" className={styles.reportGenerated}>
        Report generated at: {format(now, 'PPPPpp')}
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={6}>
          <ImpactSummary data={results?.summary} />
        </Grid>
        <Grid container item xs={6} spacing={3}>
          <ProtectedAreasList areas={results?.areas} />
        </Grid>
        <Grid container item xs={6} spacing={3}></Grid>
        <Grid container item xs={12} spacing={3}>
          <AssessmentActivityImpacts data={results?.activities} />
        </Grid>
        <Grid container item xs={6} spacing={3}></Grid>
        <Grid container item xs={6} spacing={3}>
          <ImpactFeatureDetails data={results?.impactsByFeature} />
        </Grid>
        <Grid className={styles.buttons} container item xs={6} spacing={3}>
          <Button onClick={() => exportAs(FORMATS.PDF)} size="small">
            Export as PDF
          </Button>
          <Button onClick={() => exportAs(FORMATS.CSV)} size="small">
            Export as CSV
          </Button>
          <Button onClick={() => setSaveProposalFormOpen(true)} size="small">
            Save
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
          <SaveProposalForm onSubmit={saveAssessment} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentResults;
