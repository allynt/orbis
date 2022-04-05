import React, { useState } from 'react';

import {
  CloseIcon,
  Dialog,
  IconButton,
  Tab,
  Tabs,
  makeStyles,
} from '@astrosat/astrosat-ui';

import AssessmentResults from '../assessments/assessment-results.component';
import { TabPanel } from '../assessments/impact-feature-details-nav.component';
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
    fontSize: 14,
  },
}));

const AssessmentDialog = ({ open = false, close, onSubmit }) => {
  const styles = useStyles();

  const [tab, setTab] = useState(0);

  const toggleTab = (event, tab) => setTab(tab);

  const handleClose = () => {
    close();
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <IconButton
        size="small"
        className={styles.closeButton}
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>

      <div className={styles.content}>
        <h4>Welcome to the Impact Assessment functionality for Eco-an-Alba.</h4>

        <Tabs value={tab} onChange={toggleTab}>
          <Tab label="Form" />
          <Tab label="Results" />
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
          <AssessmentDialogForm onSubmit={onSubmit} />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <AssessmentResults />
        </TabPanel>
      </div>
    </Dialog>
  );
};

export default AssessmentDialog;
