import { Dialog } from '@astrosat/astrosat-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_VIEW, DIALOG_VIEW, USER_STATUS } from './admin.constants';
import styles from './admin.module.css';
import {
  createCustomerUser,
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
  updateCustomerUser,
  deleteCustomerUser,
} from './admin.slice';
import HomeView from './home-view/home-view.component';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import { EditUserForm } from './edit-user-form/edit-user-form.component';
import { DeleteUserForm } from './delete-user-form/delete-user-form.component';
import { WithdrawUserInvitationForm } from './withdraw-invitation-form/withdraw-user-invitation-form.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import { LicenceDashboard } from './licence-dashboard/licence-dashboard.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import ContentWrapper from './content-wrapper.component';

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licenceInformation = useSelector(selectLicenceInformation);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEW.home);
  const createDialogRef = useRef(document.body);
  const [dialogForm, setDialogForm] = useState(null);

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
    setDialogForm(null);
    dispatch(createCustomerUser(values));
  };

  const activeUsers = customerUsers?.filter(
    user => user.status === USER_STATUS.active,
  );
  const pendingUsers = customerUsers?.filter(
    user => user.status === USER_STATUS.pending,
  );

  const oneAdminRemaining =
    activeUsers?.filter(au => au.type === 'MANAGER').length === 1;

  let availableLicences = null;
  if (currentCustomer && currentCustomer.licences) {
    availableLicences = currentCustomer.licences.filter(
      licence => !licence.customer_user,
    );
  }

  const licenceData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
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
            currentUser={user}
            activeUsers={activeUsers}
            pendingUsers={pendingUsers}
            oneAdminRemaining={oneAdminRemaining}
            licenceData={licenceData}
            customer={currentCustomer}
            onChangeRoleClick={user =>
              dispatch(
                updateCustomerUser({
                  ...user,
                  type: user.type === 'MANAGER' ? 'MEMBER' : 'MANAGER',
                }),
              )
            }
            onEditUserClick={user =>
              setDialogForm({ type: DIALOG_VIEW.editUser, user })
            }
            onDeleteUserClick={user =>
              setDialogForm({ type: DIALOG_VIEW.deleteUser, user })
            }
            onWithdrawInvitationClick={user =>
              setDialogForm({ type: DIALOG_VIEW.withdrawInvitation, user })
            }
          />
        );
    }
  };

  const getDialogForm = () => {
    switch (dialogForm?.type) {
      case DIALOG_VIEW.createUser:
        return (
          <CreateUserForm
            licenceInformation={licenceInformation}
            existingEmails={customerUsers?.map(cu => cu.user.email)}
            onSubmit={handleCreateUserFormSubmit}
          />
        );
      case DIALOG_VIEW.withdrawInvitation:
        return (
          <WithdrawUserInvitationForm
            user={dialogForm.user}
            withdrawInvitation={user => dispatch(deleteCustomerUser(user))}
            close={() => setDialogForm(null)}
          />
        );
      case DIALOG_VIEW.editUser:
        return (
          <EditUserForm
            user={dialogForm.user}
            customer={currentCustomer}
            availableLicences={availableLicences}
            oneAdminRemaining={oneAdminRemaining}
            editUser={editedUser => dispatch(updateCustomerUser(editedUser))}
            close={() => setDialogForm(null)}
          />
        );
      case DIALOG_VIEW.deleteUser:
        return (
          <DeleteUserForm
            user={dialogForm.user}
            deleteUser={user => dispatch(deleteCustomerUser(user))}
            close={() => setDialogForm(null)}
          />
        );
      default:
        return null;
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
        onCreateUserClick={() =>
          setDialogForm({ type: DIALOG_VIEW.createUser })
        }
      />
      <Dialog
        title={dialogForm?.type}
        isVisible={dialogForm}
        ref={createDialogRef}
        close={() => setDialogForm(null)}
      >
        {getDialogForm()}
      </Dialog>
    </div>
  );
};

export default Admin;
