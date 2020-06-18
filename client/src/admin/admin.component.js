import React, { useState } from 'react';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import UserList from './user-list.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

import styles from './admin.module.css';

export const USER_TABLE = 'home';
export const ACTIVITY_LOG = 'activity-log';
export const LICENCE_DASHBOARD = 'licence dashboard';
export const CORPORATE_ACCOUNT = 'corporate account';
export const MESSAGES = 'messages';

const Admin = ({ user, userCustomers, createUser, updateUser, copyUser, deleteUser }) => {
  const selectedCustomer = userCustomers[0];

  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);

  return (
    selectedCustomer && (
      <div className={styles.adminConsole}>
        <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />
        <div className={styles.contentPanel}>
          {visiblePanel === USER_TABLE && (
            <UserList
              user={user}
              users={selectedCustomer.users}
              createUser={createUser}
              updateUser={updateUser}
              copyUser={copyUser}
              deleteUser={deleteUser}
            />
          )}
          {visiblePanel === ACTIVITY_LOG && <div>ACTIVITY LOG GOES HERE</div>}
          {visiblePanel === LICENCE_DASHBOARD && <div>LICENCE DASHBOARD GOES HERE</div>}
          {visiblePanel === CORPORATE_ACCOUNT && <div>CORPORATE ACCOUNT GOES HERE</div>}
          {visiblePanel === MESSAGES && <div>MESSAGES GOES HERE</div>}
        </div>
        <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </div>
    )
  );
};

export default Admin;
