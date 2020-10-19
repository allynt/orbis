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
      <div className={styles.organisationLogo}>
        {customer?.logo ? (
          <img
            className={styles.logo}
            src={customer?.logo}
            alt={`${customer?.title} Logo`}
          />
        ) : (
          <DefaultCustomerLogo className={styles.logo} />
        )}
      </div>

      <h2 className={styles.organisationTitle}>{customer?.title}</h2>
    </div>
    <Button size="small" onClick={onCreateUserClick}>
      Create User
    </Button>
  </div>
);

export default OrganisationMenu;
