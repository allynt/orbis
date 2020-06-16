import React, { useState, useEffect, useSelector } from 'react';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import UserList from './user-list.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

import styles from './admin.module.css';

export const USER_TABLE = 'Users';
export const ACTIVITY_LOG = 'Activity Log';
export const LICENCE_DASHBOARD = 'Licence Dashboard';
export const CORPORATE_ACCOUNT = 'Corporate Account';
export const MESSAGES = 'Messages';

const Admin = ({ user, fetchCustomer, createUser, updateUser, copyUser, deleteUser }) => {
  useEffect(() => {
    if (!selectedCustomer) {
      fetchCustomer(user);
    }
  });

  const selectedCustomer = useSelector(state => state.admin.currentCustomer);

  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);

  return (
    selectedCustomer && (
      <div className={styles.adminConsole}>
        <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />

        {visiblePanel === USER_TABLE && (
          <UserList
            title={USER_TABLE}
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
        <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </div>
    )
  );
};

export default Admin;
