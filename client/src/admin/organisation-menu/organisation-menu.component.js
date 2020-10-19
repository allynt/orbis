import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { ADMIN_VIEW } from '../admin.constants';

import styles from './organisation-menu.module.css';

/**
 *
 * @param {{ customer: { logo?: string, name?: string },
 *           setVisiblePanel(panel: string): void,
 *           onCreateUserClick(): void
 *        }} props
 */
const OrganisationMenu = ({ customer, setVisiblePanel, onCreateUserClick }) => (
  <div className={styles.organisationMenu}>
    <div
      className={styles.organisationInfo}
      onClick={() => setVisiblePanel(ADMIN_VIEW.corporateAccount)}
    >
      <img
        className={styles.organisationLogo}
        src={customer?.logo}
        alt="Organisation Logo"
      />
      <h2 className={styles.organisationTitle}>{customer?.name}</h2>
    </div>
    <Button size="small" onClick={onCreateUserClick}>
      Create User
    </Button>
  </div>
);

export default OrganisationMenu;
