import React from 'react';
import { LicenceDashboard } from './licence-dashboard.component';

export default {
  title: 'Admin/Licence Dashboard',
  component: LicenceDashboard,
};

export const NoLicences = () => <LicenceDashboard />;

export const Licences = () => (
  <LicenceDashboard
    licenceInformation={{
      Rice: { purchased: 5, available: 3, pending: 1, active: 1 },
      Oil: { purchased: 2, available: 1, pending: 1, active: 0 },
      Health: { purchased: 10, available: 5, pending: 2, active: 3 },
    }}
  />
);
