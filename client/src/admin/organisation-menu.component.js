import React from 'react';

import { CORPORATE_ACCOUNT } from './admin.component';

import styles from './organisation-menu.module.css';

const OrganisationMenu = ({ selectedCustomer, setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div className={styles.organisationInfo}>
      <img
        className={styles.organisationLogo}
        src={selectedCustomer.logo}
        alt="Organisation Logo"
        onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}
      />
      <h2>{selectedCustomer.title}</h2>
    </div>
  </div>
);

export default OrganisationMenu;
