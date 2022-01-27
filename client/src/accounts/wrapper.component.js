import React from 'react';

import {
  Container,
  makeStyles,
  Paper,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

import ProgressiveImage from 'react-progressive-image-loading';

import { OrbisLogo } from 'components';

import placeholder from './background-placeholder.png';
import background from './background.png';

const useStyles = makeStyles(theme => ({
  page: {
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    height: '100vh',
    padding: theme.spacing(4),
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: theme.spacing(4, 12, 4),
    borderRadius: theme.shape.borderRadius * 3,
    zIndex: 1,
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
    <ThemeProvider theme="light">
      <ProgressiveImage
        preview={placeholder}
        src={background}
        render={(src, style) => (
          <div
            className={styles.background}
            style={{
              ...style,
              backgroundImage: `url(${src})`,
            }}
          />
        )}
      />
      <div className={styles.page}>
        <Paper
          elevation={20}
          component={Container}
          maxWidth="sm"
          className={styles.container}
        >
          <OrbisLogo className={styles.logo} />
          {children}
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Wrapper;
