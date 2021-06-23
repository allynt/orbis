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
    overflowY: 'auto',
    '& + &': {
      marginTop: theme.spacing(3),
    },
  },
}));

const ContentWrapper = ({ children, title }) => {
  const styles = useStyles({});
  return (
    <Paper className={styles.wrapper} elevation={5}>
      <Title variant="h1">{title}</Title>
      {children}
    </Paper>
  );
};

export default ContentWrapper;
