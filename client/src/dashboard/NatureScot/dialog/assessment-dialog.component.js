import React from 'react';

import {
  Button,
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
  Grid,
  Typography,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  dialog: {
    borderRadius: '1rem',
    height: '70%',
  },
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

  const handleSubmit = () => onSubmit();

  const handleClose = () => {
    close();
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      PaperProps={{ className: styles.dialog }}
      open={open}
      onClose={handleClose}
    >
      <IconButton
        size="small"
        className={styles.closeButton}
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>

      <div className={styles.content}>
        <h4>Welcome to the Impact Assessment functionality for Eco-an-Alba.</h4>
        <p className={styles.overviewText}>
          This feature will show you the impacts of a proposed change or
          development within your area of interest.
          <span className={styles.overviewHighlightedText}>
            Please note, it does not replace the consent or consultation
            processes.
          </span>
          Applications should continue to be made to NatureScot.
        </p>
        <Button onClick={() => handleSubmit()}>Submit Assessment</Button>
      </div>
    </Dialog>
  );
};

export default AssessmentDialog;
