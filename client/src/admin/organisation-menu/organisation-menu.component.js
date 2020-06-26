import React from 'react';

import { ADMIN_VIEW } from '../admin.constants';

import styles from './organisation-menu.module.css';
import { Button } from '@astrosat/astrosat-ui';

const OrganisationMenu = ({ customer, setVisiblePanel }) => (
  <div className={styles.organisationMenu}>
    <div className={styles.organisationInfo} onClick={() => setVisiblePanel(ADMIN_VIEW.corporateAccount)}>
      <img className={styles.organisationLogo} src={customer?.logo} alt="Organisation Logo" />
      <h2 className={styles.organisationTitle}>{customer?.title}</h2>
    </div>
    <Button>Create User</Button>
  </div>
);

export default OrganisationMenu;
