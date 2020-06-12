import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { LICENCE_DASHBOARD, CORPORATE_ACCOUNT } from './admin.component';

import styles from './organisation-menu.module.css';

const OrganisationMenu = ({ setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div
      className={styles.organisationInfo}
      onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}
      data-testid="organization-info-container"
    >
      <picture>
        <source srcSet="https://www.logodesignlove.com/images/monograms/tesla-symbol.jpg" />
        <img
          className={styles.organisationLogo}
          src="https://www.logodesignlove.com/images/monograms/tesla-symbol.jpg"
          alt="Organisation Logo"
        />
      </picture>
      <h2>Tesla, Inc</h2>
    </div>
    <div className={styles.buttons}>
      <Button theme="primary" onClick={() => setVisiblePanel(LICENCE_DASHBOARD)}>
        Assign Users
      </Button>
      <Button theme="primary" disabled={true}>
        ALL ORBS
      </Button>
    </div>
    <ul>
      <Button theme="link">COVID-19</Button>
      <Button theme="link">Rice Paddies</Button>
    </ul>
  </div>
);

export default OrganisationMenu;