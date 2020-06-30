import React from 'react';
import { LicenceDashboard } from './licence-dashboard.component';

export default { title: 'Admin/Licence Dashboard', component: LicenceDashboard };

export const NoLicences = () => <LicenceDashboard />;

export const Licences = () => (
  <LicenceDashboard
    licences={[
      { orb: 'Rice' },
      { orb: 'Oil', customer_user: 1 },
      { orb: 'Rice', customer_user: 2 },
      { orb: 'Health', customer_user: '1' },
      { orb: 'Rice', customer_user: 1 },
      { orb: 'Health' },
      { orb: 'Health', customer_user: 3 },
      { orb: 'Oil', customer_user: 3 },
      { orb: 'Health', customer_user: 2 },
      { orb: 'Health' },
    ]}
  />
);
