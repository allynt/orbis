import React from 'react';

import { makeStyles, Paper, Typography } from '@astrosat/astrosat-ui';

const useTitleStyles = makeStyles(theme => ({
  h1: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(0.25),
    margin: 'auto',
    marginBottom: theme.spacing(2),
    width: 'fit-content',
    textAlign: 'center',
  },
}));

const useWrapperStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(2),
    width: '100%',
    overflowY: 'auto',
    '& + &': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Title = ({ children }) => {
  const styles = useTitleStyles({});
  return (
    <Typography variant="h1" classes={styles}>
      {children}
    </Typography>
  );
};

const ContentWrapper = ({ children, title }) => {
  const styles = useWrapperStyles({});
  return (
    <Paper className={styles.wrapper} elevation={5}>
      <Title>{title}</Title>
      {children}
    </Paper>
  );
};

export default ContentWrapper;
