import React from 'react';

import { ReactComponent as OrbisAdminIcon } from '../orbis-admin-icon.svg';

export const DefaultCustomerLogo = ({ className }) => (
  <div style={{ height: '100%', width: '100%' }}>
    <OrbisAdminIcon className={className} />
  </div>
);
