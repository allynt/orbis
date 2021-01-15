import {
  Box,
  Button,
  Grid,
  Link,
  makeStyles,
  ThemeProvider,
  Typography,
} from '@astrosat/astrosat-ui';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { OrbisLogo } from 'components';
import Eula from './end-user-licence-agreement.component';
import { DOCUMENT, EULA, PRIVACY_POLICY } from './legal-documents-constants';
import styles from './legal-documents.module.css';
import { PrivacyPolicy } from './privacy-policy.component';
import TermsAndConditions from './terms-and-conditions.component';

const eulaHeaderText = `In the event that your company has a pre-existing wet signature contract with Astrosat that conflicts with this EULA, then the conditions of that contract shall be deemed to prevail. You should have been given a copy of the associated EULA, please contact your organisation's administrator if this is not the case.`;

const termsHeaderText = `In the event that your company has a pre-existing wet signature contract with Astrosat that conflicts with these Terms and Conditions, then the conditions of that contract shall be deemed to prevail.`;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    color: theme.palette.secondary.main,
  },
  content: {
    padding: theme.spacing(2),
    margin: 0,
  },
  logo: {
    width: '10rem',
  },
  button: {
    fontSize: '1.75rem',
    '&$unselected': {
      borderColor: 'transparent',
    },
  },
  header: {
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    gridColumn: '1 / -1',
  },
  preamble: {
    gridColumn: '1 / -1',
  },
  unselected: {},
}));

const LegalDocuments = ({ match }) => {
  const styles = useStyles();
  const Component = match.path === EULA ? Eula : TermsAndConditions;
  const buttonText =
    match.path === EULA ? 'End User License Agreement' : 'Terms and Conditions';

  const [info, setInfo] = useState(DOCUMENT);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ThemeProvider theme="dark">
          <RouterLink to="/">
            <OrbisLogo className={styles.logo} />
          </RouterLink>
        </ThemeProvider>
      </div>
      <Grid className={styles.content} container spacing={2}>
        <Grid item xs={12}>
          <Typography color="inherit" paragraph className={styles.preamble}>
            {match.path === EULA ? eulaHeaderText : termsHeaderText}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Link
            component="button"
            className={`${styles.button} ${
              info === PRIVACY_POLICY && styles.unselected
            }`}
            onClick={() => setInfo(DOCUMENT)}
          >
            {buttonText}
          </Link>
          <Link
            component="button"
            className={`${styles.button} ${
              info !== PRIVACY_POLICY && styles.unselected
            }`}
            onClick={() => {
              setInfo(PRIVACY_POLICY);
            }}
          >
            Privacy Policy
          </Link>
        </Grid>
        <Grid item xs={9}>
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
          {info === DOCUMENT && (
            <Component onClick={() => setInfo(PRIVACY_POLICY)} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default LegalDocuments;
