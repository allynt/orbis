import React from 'react';

import {
  Button,
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
  Typography,
  Grid,
} from '@astrosat/astrosat-ui';

import { dialogWelcomeText } from './dialog.constants';

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
    color: '#f6be00',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
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
        <h2>Impact Assessment Components</h2>
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item>
            <Typography variant="h3">{dialogWelcomeText.heading}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              {dialogWelcomeText.overviewStandardTextPart1}
              <span className={styles.overviewHighlightedText}>
                {dialogWelcomeText.overviewHighlightedText}
              </span>
              {dialogWelcomeText.overviewStandardTextPart2}
            </Typography>
          </Grid>
        </Grid>
        <Button onClick={() => handleSubmit()}>Submit Assessment</Button>
      </div>
    </Dialog>
  );
};

export default AssessmentDialog;
