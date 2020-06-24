import React from 'react';

import CorporateAccount from './corporate-account.component';
import AdministratorProfile from './administrator-profile.component';

import styles from './corporate.module.css';

const Corporate = ({ user, customer }) => (
  <div className={styles.corporate}>
    <CorporateAccount customer={customer} />
    <AdministratorProfile user={user} />
  </div>
);

export default Corporate;
