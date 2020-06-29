import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog } from '@astrosat/astrosat-ui';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { ADMIN_VIEW, USER_STATUS } from './admin.constants';
import { fetchCustomer, fetchCustomerUsers } from './admin.slice';
import ContentWrapper from './content-wrapper.component';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

import styles from './admin.module.css';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const selectedCustomer = useSelector(state => state.admin.currentCustomer);
  const selectedCustomerUsers = useSelector(state => state.admin.customerUsers);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEW.home);
  const createUserDialogRef = useRef(document.body);
  const [createUserDialogVisible, setCreateUserDialogVisible] = useState();

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
    <div className={styles.adminConsole}>
      <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />
      {visiblePanel === ADMIN_VIEW.home && (
        <ContentWrapper title="Users">
          <ActiveUsersBoard activeUsers={selectedCustomerUsers?.filter(user => user.status === USER_STATUS.active)} />
        </ContentWrapper>
      )}
      {visiblePanel === ADMIN_VIEW.corporateAccount && <CorporateView user={user} customer={selectedCustomer} />}
      <OrganisationMenu
        customer={selectedCustomer}
        setVisiblePanel={setVisiblePanel}
        onCreateUserClick={() => setCreateUserDialogVisible(true)}
      />
      <Dialog
        title="Create New User"
        isVisible={createUserDialogVisible}
        ref={createUserDialogRef}
        close={() => setCreateUserDialogVisible(false)}
      >
        <CreateUserForm />
      </Dialog>
    </div>
  );
};

export default Admin;
