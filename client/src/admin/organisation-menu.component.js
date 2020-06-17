import React from 'react';

import { CORPORATE_ACCOUNT } from './admin.component';

import styles from './organisation-menu.module.css';

const OrganisationMenu = ({ customer, setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div className={styles.organisationInfo}>
      <img
        className={styles.organisationLogo}
        src={customer.logo}
        alt="Organisation Logo"
        onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}
      />
      <h2 className={styles.organisationTitle}>{customer.title}</h2>
    </div>
  </div>
);

export default OrganisationMenu;
