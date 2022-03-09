import React from 'react';

import {
  Button,
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
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
        <Button onClick={() => handleSubmit()}>Submit Assessment</Button>
      </div>
    </Dialog>
  );
};

export default AssessmentDialog;
