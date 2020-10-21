import React from 'react';

import { ReactComponent as OrbisAdminIcon } from '../orbis-admin-icon.svg';

import styles from './admin.module.css';

export const DefaultCustomerLogo = () => (
  <div className={styles.defaultLogoContainer}>
    <OrbisAdminIcon />
  </div>
);
