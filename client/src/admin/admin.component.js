import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog } from '@astrosat/astrosat-ui';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { ADMIN_VIEW, USER_STATUS } from './admin.constants';
import {
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicencesAndAvailability,
  createCustomerUser,
} from './admin.slice';
import ContentWrapper from './content-wrapper.component';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

import styles from './admin.module.css';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licencesAndAvailability = useSelector(selectLicencesAndAvailability);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEW.home);
  const createUserDialogRef = useRef(document.body);
  const [createUserDialogVisible, setCreateUserDialogVisible] = useState();

  useEffect(() => {
    if (!currentCustomer) {
      dispatch(fetchCustomer(user));
    }
  }, [user, currentCustomer, dispatch]);

  useEffect(() => {
    if (currentCustomer && !customerUsers) {
      dispatch(fetchCustomerUsers(currentCustomer));
    }
  }, [currentCustomer, customerUsers, dispatch]);

  const handleCreateUserFormSubmit = values => {
    setCreateUserDialogVisible(false);
    dispatch(createCustomerUser(values));
  };

  return (
    <div className={styles.adminConsole}>
      <LeftSidebar user={user} setVisiblePanel={setVisiblePanel} visiblePanel={visiblePanel} />
      {visiblePanel === ADMIN_VIEW.home && (
        <ContentWrapper title="Users">
          <ActiveUsersBoard activeUsers={customerUsers?.filter(user => user.status === USER_STATUS.active)} />
        </ContentWrapper>
      )}
      {visiblePanel === ADMIN_VIEW.corporateAccount && <CorporateView user={user} customer={currentCustomer} />}
      <OrganisationMenu
        customer={currentCustomer}
        setVisiblePanel={setVisiblePanel}
        onCreateUserClick={() => setCreateUserDialogVisible(true)}
      />
      <Dialog
        title="Create New User"
        isVisible={createUserDialogVisible}
        ref={createUserDialogRef}
        close={() => setCreateUserDialogVisible(false)}
      >
        <CreateUserForm
          licences={licencesAndAvailability}
          existingEmails={customerUsers?.map(cu => cu.user.email)}
          onSubmit={handleCreateUserFormSubmit}
        />
      </Dialog>
    </div>
  );
};

export default Admin;
