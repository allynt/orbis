import React from 'react';

import CorporateAccount from './corporate-account/corporate-account.component';
import AdministratorProfile from './adminstrator-profile/administrator-profile.component';

import styles from './corporate-view.module.css';

export const Field = ({ children }) => (
  <div className={styles.fieldContainer}>{children}</div>
);

const CorporateView = ({ user, customer }) => (
  <div className={styles.corporate}>
    <CorporateAccount customer={customer} />
    <AdministratorProfile user={user} />
  </div>
);

export default CorporateView;
