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

/**
 * @param {{
 *  impactAssessment: object,
 *  formState: object,
 *  updateAssessment: function,
 *  saveAssessment: function,
 *  reportGeneratedTimestamp: DateRange<string>
 * }} props
 */
const AssessmentResults = ({
  impactAssessment,
  formState,
  updateAssessment,
  saveAssessment,
  reportGeneratedTimestamp,
}) => {
  const styles = useStyles();

  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [saveProposalFormOpen, setSaveProposalFormOpen] = useState(false);

  const exportAs = type =>
    console.log('Export: ', selectedAssessments, ' as: ', type);

  /**
   * @param {{
   * name: string,
   * description?: string
   * }} newSaveForm
   */
  const saveAssessmentAndCloseDialog = newSaveForm => {
    saveAssessment({
      ...formState,
      ...newSaveForm,
      impactAssessment,
      reportGenerated: reportGeneratedTimestamp.toISOString(),
    });
    setSaveProposalFormOpen(false);
  };

  const saveOrUpdateAssessment = () =>
    !formState.id
      ? setSaveProposalFormOpen(true)
      : updateAssessment({
          ...formState,
          impactAssessment,
          reportGenerated: reportGeneratedTimestamp.toISOString(),
        });

  return (
    <>
      {!!reportGeneratedTimestamp ? (
        <Typography variant="h4" className={styles.reportGenerated}>
          Report generated at: {format(reportGeneratedTimestamp, 'PPPPpp')}
        </Typography>
      ) : null}

      <Grid container spacing={5}>
        <Grid item xs={6}>
          {!impactAssessment ? (
            <ImpactSummarySkeleton />
          ) : (
            <ImpactSummary data={impactAssessment?.summary} />
          )}
        </Grid>
        <Grid container item xs={6}>
          {!impactAssessment ? (
            <ProtectedAreasListSkeleton />
          ) : (
            <ProtectedAreasList areas={impactAssessment?.areas} />
          )}
        </Grid>
        <Grid container item xs={12}>
          {!impactAssessment ? (
            <AssessmentActivityImpactsSkeleton />
          ) : (
            <AssessmentActivityImpacts data={impactAssessment?.activities} />
          )}
        </Grid>
        <Grid container item xs={6}></Grid>
        <Grid container item xs={6}>
          {!impactAssessment ? (
            <AssessmentActivityImpactsSkeleton />
          ) : (
            <ImpactFeatureDetails data={impactAssessment?.impacts_by_feature} />
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
            disabled={
              !impactAssessment.activities ||
              impactAssessment.activities.length === 0
            }
            onClick={() => saveOrUpdateAssessment()}
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
