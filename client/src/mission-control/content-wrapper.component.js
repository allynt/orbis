import React from 'react';

import { makeStyles, Paper, Box, Typography } from '@astrosat/astrosat-ui';

import { ReactComponent as NumberHalo } from './number-halo.svg';

const useTitleStyles = makeStyles(theme => ({
  title: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
    width: 'fit-content',
  },
  haloIcon: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  number: {
    position: 'absolute',
    height: 'fit-content',
    left: '1.16rem',
    bottom: '0.45rem',
  },
  h1: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: '0.25rem',
  },
}));

const useWrapperStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    width: '100%',
    maxHeight: theme.spacing(90),
    overflowY: 'auto',
    '& + &': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Title = ({ children, number }) => {
  const styles = useTitleStyles({});
  return (
    <h1 className={styles.title}>
      <span className={styles.number}>{number}</span>
      <NumberHalo color="#fff" className={styles.haloIcon} />
      <span className={styles.h1}>{children}</span>
    </h1>
  );
};

const ContentWrapper = ({ children, title, number }) => {
  const styles = useWrapperStyles({});
  return (
    <Paper className={styles.wrapper} elevation={5}>
      <Title number={number}>{title}</Title>
      {children}
    </Paper>
  );
};

export default ContentWrapper;
