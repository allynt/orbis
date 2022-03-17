import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  dashboard: {
    overflowY: 'scroll',
    width: '100%',
  },
}));

const TascomiDashboard = ({ sourceId }) => {
  const styles = useStyles({});

  return <div className={styles.dashboard}>Tascomi Project Details</div>;
};

export default TascomiDashboard;
