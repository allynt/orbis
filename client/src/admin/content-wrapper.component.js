import React from 'react';

import { makeStyles, Paper, styled, Typography } from '@astrosat/astrosat-ui';

const Title = styled(Typography)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(4),
    width: '100%',
    marginBottom: theme.spacing(3),
    overflowY: 'auto',
    height: props =>
      props.fullHeight &&
      `calc(100vh - calc(2 * ${theme.typography.pxToRem(theme.spacing(3))}))`,
    maxHeight: props =>
      props.fullHeight &&
      `calc(100vh - calc(2 * ${theme.typography.pxToRem(theme.spacing(3))}))`,
    '&:last-of-type': {
      marginBottom: 0,
    },
  },
}));

const ContentWrapper = ({ children, title, fullHeight = false }) => {
  const styles = useStyles({ fullHeight });
  return (
    <Paper className={styles.wrapper} elevation={5}>
      <Title variant="h1">{title}</Title>
      {children}
    </Paper>
  );
};

export default ContentWrapper;
