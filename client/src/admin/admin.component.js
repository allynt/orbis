import { Dialog } from '@astrosat/astrosat-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { ADMIN_VIEW, USER_STATUS } from './admin.constants';
import styles from './admin.module.css';
import {
  createCustomerUser,
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicencesAndAvailability,
  selectLicenceInformation,
} from './admin.slice';
import ContentWrapper from './content-wrapper.component';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import { LicenceDashboard } from './licence-dashboard/licence-dashboard.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licencesAndAvailability = useSelector(selectLicencesAndAvailability);
  const licenceInformation = useSelector(selectLicenceInformation);
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

  const getMainView = () => {
    switch (visiblePanel) {
      case ADMIN_VIEW.corporateAccount:
        return <CorporateView user={user} customer={currentCustomer} />;
      case ADMIN_VIEW.licenceDashboard:
        return (
          <ContentWrapper title="Licence Dashboard">
            <LicenceDashboard licenceInformation={licenceInformation} />
          </ContentWrapper>
        );
      case ADMIN_VIEW.home:
      default:
        return (
          <ContentWrapper title="Users">
            <ActiveUsersBoard
              activeUsers={customerUsers?.filter(
                user => user.status === USER_STATUS.active,
              )}
            />
          </ContentWrapper>
        );
    }
  };

  return (
    <div className={styles.adminConsole}>
      <LeftSidebar
        user={user}
        setVisiblePanel={setVisiblePanel}
        visiblePanel={visiblePanel}
      />
      {getMainView()}
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
