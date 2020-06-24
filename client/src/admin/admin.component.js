import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LeftSidebar from './left-sidebar/left-sidebar.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import ContentWrapper from './content-wrapper.component';

import styles from './admin.module.css';
import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { fetchCustomer, fetchCustomerUsers } from './admin.slice';

import { USER_STATUS, ADMIN_VIEWS } from './admin.constants';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const selectedCustomer = useSelector(state => state.admin.currentCustomer);
  const selectedCustomerUsers = useSelector(state => state.admin.customerUsers);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEWS.home);

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
        {visiblePanel === ADMIN_VIEWS.home && (
          <ContentWrapper title="Users">
            <ActiveUsersBoard activeUsers={selectedCustomerUsers?.filter(user => user.status === USER_STATUS.active)} />
          </ContentWrapper>
        )}
        {visiblePanel === ADMIN_VIEWS.corporateAccount && <div>CORPORATE ACCOUNT GOES HERE</div>}
        <OrganisationMenu customer={selectedCustomer} setVisiblePanel={setVisiblePanel} />
      </div>
    )
  );
};

export default Admin;
