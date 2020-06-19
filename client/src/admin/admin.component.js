import React, { useState } from 'react';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import ContentWrapper from './content-wrapper.component';

import styles from './admin.module.css';
import { ActiveUsersBoard } from './active-users-board/active-users-board.component';

export const USER_TABLE = 'Users';
export const ACTIVITY_LOG = 'Activity Log';
export const LICENCE_DASHBOARD = 'Licence Dashboard';
export const CORPORATE_ACCOUNT = 'Corporate Account';
export const MESSAGES = 'Messages';

const Admin = ({ user, userCustomers }) => {
  const selectedCustomer = userCustomers[0];

  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);

  return (
    selectedCustomer && (
      <div className={styles.adminConsole}>
        <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />
        {visiblePanel === USER_TABLE && (
          <ContentWrapper title="Users">
            <ActiveUsersBoard activeUsers={selectedCustomer.users} />
          </ContentWrapper>
        )}
        {visiblePanel === CORPORATE_ACCOUNT && <div>CORPORATE ACCOUNT GOES HERE</div>}
        <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </div>
    )
  );
};

export default Admin;
