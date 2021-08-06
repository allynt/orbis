import React from 'react';

import { makeStyles, Paper } from '@astrosat/astrosat-ui';

const useTitleStyles = makeStyles(theme => ({
  title: {
    fontWeight: 'normal',
    fontSize: '1.75rem',
    margin: 'auto',
    marginBottom: theme.spacing(4),
    width: 'fit-content',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

const useWrapperStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(2),
    borderRadius: '1rem',
    width: '100%',
    maxHeight: '45rem',
    minHeight: '45rem',
    overflowY: 'auto',
    '& + &': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Title = ({ children }) => {
  const styles = useTitleStyles({});
  return <h1 className={styles.title}>{children}</h1>;
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
