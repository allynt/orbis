import React, { useState } from 'react';

import AdminSideMenu from './admin-side-menu.component';
import UserList from './user-list.component';
import OrganisationMenu from './organisation-menu.component';

import styles from './admin.module.css';

export const USER_TABLE = 'home';
export const ACTIVITY_LOG = 'activity-log';
export const LICENCE_DASHBOARD = 'licence dashboard';
export const CORPORATE_ACCOUNT = 'corporate account';
export const MESSAGES = 'messages';

const Admin = ({ user, users, fetchUsers, createUser, updateUser, copyUser, deleteUser }) => {
  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);
  return (
    <div className={styles.adminConsole}>
      <AdminSideMenu user={user} setVisiblePanel={setVisiblePanel} />
      <div className={styles.contentPanel}>
        {visiblePanel === USER_TABLE && (
          <UserList
            user={user}
            users={users}
            fetchUsers={fetchUsers}
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
      <OrganisationMenu setVisiblePanel={setVisiblePanel} />
    </div>
  );
};

export default Admin;
