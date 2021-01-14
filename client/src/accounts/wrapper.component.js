import React from 'react';

import { OrbisLogo } from 'components';
import {
  Container,
  makeStyles,
  Paper,
  ThemeProvider,
} from '@astrosat/astrosat-ui';
import background from './background.png';

const useStyles = makeStyles(theme => ({
  page: {
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    height: '100vh',
    padding: theme.spacing(4),
    background: `url(${background})`,
    backgroundSize: 'cover',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: theme.spacing(4, 12, 4),
    borderRadius: theme.shape.borderRadius * 3,
  },
  logo: {
    width: '11.5rem',
    minHeight: '6rem',
    margin: `0 auto ${theme.spacing(3)} auto`,
  },
}));

const Wrapper = ({ children }) => {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <ThemeProvider theme="light">
        <Paper
          elevation={20}
          component={Container}
          maxWidth="sm"
          className={styles.container}
        >
          <OrbisLogo className={styles.logo} />
          {children}
        </Paper>
      </ThemeProvider>
    </div>
  );
};

export default Wrapper;
