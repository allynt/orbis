import React from 'react';

import CorporateAccount from './corporate-account/corporate-account.component';
import AdministratorProfile from './adminstrator-profile/administrator-profile.component';

import styles from './corporate-view.module.css';

const CorporateView = ({
  user,
  customer,
  updateCustomer,
  updateAdministrator,
}) => (
  <div className={styles.corporate}>
    <CorporateAccount customer={customer} updateCustomer={updateCustomer} />
    <AdministratorProfile
      user={user}
      updateAdministrator={updateAdministrator}
    />
  </div>
);

export default CorporateView;
