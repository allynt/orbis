import React from 'react';

import { CORPORATE_ACCOUNT } from './admin.component';

import styles from './organisation-menu.module.css';

const OrganisationMenu = ({ selectedCustomer, setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div
      className={styles.organisationInfo}
      onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}
      data-testid="organization-info-container"
    >
      <img className={styles.organisationLogo} src={selectedCustomer.logo} alt="Organisation Logo" />
      <h2>{selectedCustomer.title}</h2>
    </div>
  </div>
);

export default OrganisationMenu;
