import React from 'react';

import { Grid, Typography, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  wrapper: {
    overflowY: 'scroll',
    width: '100%',
  },
  header: {
    padding: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

/**
 * @param {{
 *   title?: string
 *   HeaderComponent?: React.ReactNode
 *   isTabs?: boolean
 *   children: React.ReactNode
 * }} props
 */
const DashboardWrapper = ({
  title,
  HeaderComponent,
  isTabs = false,
  children,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.wrapper}>
      {!!title || !!HeaderComponent ? (
        <Grid
          container
          justifyContent={
            !!HeaderComponent && !!title ? 'space-between' : 'flex-start'
          }
          alignItems="center"
          className={!isTabs ? styles.header : null}
        >
          {!!title ? <Typography variant="h2">{title}</Typography> : null}
          {!!HeaderComponent ? HeaderComponent : null}
        </Grid>
      ) : null}
      {children}
    </div>
  );
};

export default DashboardWrapper;
