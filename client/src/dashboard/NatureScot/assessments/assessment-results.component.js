import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch } from 'react-redux';

import { ImpactSummary } from '../charts/impact-summary/impact-summary.component';
import { saveProposal } from '../nature-scot.slice';
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
}));

const FORMATS = {
  PDF: 'PDF',
  CSV: 'CSV',
};

const AssessmentResults = ({ results, impactAssessmentForm }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [saveProposalFormOpen, setSaveProposalFormOpen] = useState(false);

  const exportAs = type =>
    console.log('Export: ', selectedAssessments, ' as: ', type);

  const saveAssessment = form =>
    dispatch(
      // @ts-ignore
      saveProposal({
        ...form,
        geometry: impactAssessmentForm.geometry,
        proposal_description: impactAssessmentForm.description,
        proposal_start_date: impactAssessmentForm.startDate,
        proposal_end_date: impactAssessmentForm.endDate,
        proposal_activities: impactAssessmentForm.activities,
        report_state: results,
      }),
    );

  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <ImpactSummary data={results?.summary} />
        </Grid>
        <Grid container item xs={6} spacing={3}>
          <ProtectedAreasList areas={results?.areas} />
        </Grid>
        <Grid container item xs={6} spacing={3}></Grid>
        <Grid container item xs={6} spacing={3}>
          <ImpactFeatureDetails data={results} />
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
