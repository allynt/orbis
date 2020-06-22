import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import UserList from './user-list.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

import styles from './admin.module.css';
import { fetchCustomerUsers } from './admin.slice';

export const USER_TABLE = 'Users';
export const ACTIVITY_LOG = 'Activity Log';
export const LICENCE_DASHBOARD = 'Licence Dashboard';
export const CORPORATE_ACCOUNT = 'Corporate Account';
export const MESSAGES = 'Messages';

const Admin = ({
  user,
  fetchCustomer,
  fetchCustomerUsers,
  createCustomerUser,
  updateCustomerUser,
  copyCustomerUser,
  deleteCustomerUser,
}) => {
  const selectedCustomer = useSelector(state => state.admin.currentCustomer);
  const selectedCustomerUsers = useSelector(state => state.admin.customerUsers);
  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);

  useEffect(() => {
    if (!selectedCustomer) {
      fetchCustomer(user);
    }
  }, [user, selectedCustomer, fetchCustomer]);

  useEffect(() => {
    if (selectedCustomer && !selectedCustomerUsers) {
      fetchCustomerUsers(selectedCustomer);
    }
  }, [selectedCustomer, selectedCustomerUsers, fetchCustomerUsers]);

  return (
    selectedCustomer && (
      <div className={styles.adminConsole}>
        <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />

        {visiblePanel === USER_TABLE && (
          <UserList
            title={USER_TABLE}
            user={user}
            customer={selectedCustomer}
            users={selectedCustomerUsers}
            createCustomerUser={createCustomerUser}
            updateCustomerUser={updateCustomerUser}
            copyCustomerUser={copyCustomerUser}
            deleteCustomerUser={deleteCustomerUser}
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
