import { Dialog } from '@astrosat/astrosat-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_VIEW } from './admin.constants';
import styles from './admin.module.css';
import {
  createCustomerUser,
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
  deleteCustomerUser,
} from './admin.slice';
import HomeView from './home-view/home-view.component';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import { EditUserForm } from './edit-user-form/edit-user-form.component';
import { WithdrawUserInvitationForm } from './withdraw-invitation-form/withdraw-user-invitation-form.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import { LicenceDashboard } from './licence-dashboard/licence-dashboard.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import ContentWrapper from './content-wrapper.component';

const CREATE_USER = 'Create New User';
const EDIT_USER = 'Edit User';
const WITHDRAW_INVITATION = 'Withdraw Invitation';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licenceInformation = useSelector(selectLicenceInformation);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEW.home);
  const createDialogRef = useRef(document.body);
  const [dialog, setDialog] = useState(null);

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
    setDialog(false);
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
          <HomeView
            users={customerUsers}
            customer={currentCustomer}
            onEditUserClick={user => setDialog({ type: EDIT_USER, user })}
            onWithdrawInvitationClick={user =>
              setDialog({ type: WITHDRAW_INVITATION, user })
            }
          />
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
        onCreateUserClick={() => setDialog({ type: CREATE_USER })}
      />
      <Dialog
        title={dialog?.type}
        isVisible={dialog}
        ref={createDialogRef}
        close={() => setDialog(null)}
      >
        {dialog?.type === CREATE_USER && (
          <CreateUserForm
            licenceInformation={licenceInformation}
            existingEmails={customerUsers?.map(cu => cu.user.email)}
            onSubmit={handleCreateUserFormSubmit}
          />
        )}
        {dialog?.type === EDIT_USER && <EditUserForm user={dialog.user} />}
        {dialog?.type === WITHDRAW_INVITATION && (
          <WithdrawUserInvitationForm
            user={dialog.user}
            withdrawInvitation={user =>
              dispatch(deleteCustomerUser(currentCustomer, user))
            }
            close={() => setDialog(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Admin;
