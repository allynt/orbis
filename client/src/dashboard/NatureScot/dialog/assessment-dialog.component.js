import React, { useEffect, useState } from 'react';

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

const AssessmentDialog = ({
  visibleTab,
  open = false,
  close,
  onSubmit,
  results,
  selectedAoi,
}) => {
  const styles = useStyles();

  const [tab, setTab] = useState(visibleTab);

  const toggleTab = (event, tab) => setTab(tab);

  const handleClose = () => {
    close();
  };

  useEffect(() => setTab(visibleTab), [visibleTab, setTab]);

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
        <h3>Welcome to the Impact Assessment functionality for Eco-an-Alba.</h3>

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
          <AssessmentDialogForm onSubmit={onSubmit} selectedAoi={selectedAoi} />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <AssessmentResults results={results} />
        </TabPanel>
      </div>
    </Dialog>
  );
};

export default AssessmentDialog;
