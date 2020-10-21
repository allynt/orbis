import React from 'react';

import { Button } from '@astrosat/astrosat-ui';

import { ADMIN_VIEW } from '../admin.constants';

import { DefaultCustomerLogo } from '../default-customer-logo.component';

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
      {customer?.logo ? (
        <div className={styles.organisationLogo}>
          <img
            className={styles.logo}
            src={customer?.logo}
            alt={`${customer?.title} Logo`}
          />
        </div>
      ) : (
        <DefaultCustomerLogo />
      )}

      <h2 className={styles.organisationTitle}>{customer?.title}</h2>
    </div>
    <Button size="small" onClick={onCreateUserClick}>
      Create User
    </Button>
  </div>
);

export default OrganisationMenu;
