import React, { useState } from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { Link } from 'react-router-dom';

import { ReactComponent as OrbisLogo } from '../orbis-light.svg';
import Eula from './end-user-licence-agreement.component';
import { DOCUMENT, EULA, PRIVACY_POLICY } from './legal-documents-constants';
import styles from './legal-documents.module.css';
import { PrivacyPolicy } from './privacy-policy.component';
import TermsAndConditions from './terms-and-conditions.component';

const LegalDocuments = ({ match }) => {
  const Component = match.path === EULA ? Eula : TermsAndConditions;
  const buttonText =
    match.path === EULA ? 'End User License Agreement' : 'Terms and Conditions';

  const [info, setInfo] = useState(DOCUMENT);
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Link to="/">
          <OrbisLogo className={styles.logo} />
        </Link>
      </div>
      <p className={styles.headerText}>
        In the event that your company has a pre-existing wet signature contract
        with Astrosat that conflicts with these Terms and Conditions, then the
        conditions of that contract shall be deemed to prevail.
      </p>
      <div className={styles.body}>
        <div className={styles.buttons}>
          <div>
            <Button
              theme="link"
              classNames={`${styles.button} ${
                info === PRIVACY_POLICY && styles.unselected
              }`}
              onClick={() => setInfo(DOCUMENT)}
            >
              {buttonText}
            </Button>
          </div>
          <div>
            <Button
              theme="link"
              classNames={`${styles.button} ${
                info !== PRIVACY_POLICY && styles.unselected
              }`}
              onClick={() => {
                setInfo(PRIVACY_POLICY);
              }}
            >
              Privacy Policy
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          {info === PRIVACY_POLICY && <PrivacyPolicy />}
          {info === DOCUMENT && (
            <Component onClick={() => setInfo(PRIVACY_POLICY)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalDocuments;
