import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import ContentWrapper from './content-wrapper.component';

import styles from './admin.module.css';
import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { fetchCustomer, fetchCustomerUsers } from './admin.slice';

import { USER_STATUS } from './admin.constants';

export const USER_TABLE = 'Users';
export const ACTIVITY_LOG = 'Activity Log';
export const LICENCE_DASHBOARD = 'Licence Dashboard';
export const CORPORATE_ACCOUNT = 'Corporate Account';
export const MESSAGES = 'Messages';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const selectedCustomer = useSelector(state => state.admin.currentCustomer);
  const selectedCustomerUsers = useSelector(state => state.admin.customerUsers);
  const [visiblePanel, setVisiblePanel] = useState(USER_TABLE);

  useEffect(() => {
    if (!selectedCustomer) {
      dispatch(fetchCustomer(user));
    }
  }, [user, selectedCustomer, dispatch]);

  useEffect(() => {
    if (selectedCustomer && !selectedCustomerUsers) {
      dispatch(fetchCustomerUsers(selectedCustomer));
    }
  }, [selectedCustomer, selectedCustomerUsers, dispatch]);

  return (
    selectedCustomer && (
      <div className={styles.adminConsole}>
        <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />
        {visiblePanel === USER_TABLE && (
          <ContentWrapper title="Users">
            <ActiveUsersBoard activeUsers={selectedCustomerUsers?.filter(user => user.status === USER_STATUS.active)} />
          </ContentWrapper>
        )}
        {visiblePanel === CORPORATE_ACCOUNT && <div>CORPORATE ACCOUNT GOES HERE</div>}
        <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </div>
    )
  );
};

export default Admin;
