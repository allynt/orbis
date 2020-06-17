import React from 'react';

import { CORPORATE_ACCOUNT } from '../admin.component';

import styles from './organisation-menu.module.css';

const OrganisationMenu = ({ customer, setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div className={styles.organisationInfo} onClick={() => setVisiblePanel(CORPORATE_ACCOUNT)}>
      <img className={styles.organisationLogo} src={customer.logo} alt="Organisation Logo" />
      <h2 className={styles.organisationTitle}>{customer.title}</h2>
    </div>
  </div>
);

export default OrganisationMenu;
