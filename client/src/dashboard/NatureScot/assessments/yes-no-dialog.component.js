import React from 'react';

import {
  CloseIcon,
  Dialog,
  IconButton,
  makeStyles,
} from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 20,
    minHeight: '20rem',
  },
}));

const YesNoDialog = ({ isOpen, close, children }) => {
  const styles = useStyles();
  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md">
      <IconButton size="small" className={styles.closeButton} onClick={close}>
        <CloseIcon fontSize="inherit" />
      </IconButton>

      <div className={styles.content}>{children}</div>
    </Dialog>
  );
};

export default YesNoDialog;
