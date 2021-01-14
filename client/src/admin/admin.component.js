import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  CloseIcon,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  styled,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

import { updateUser } from '../accounts/accounts.slice';
import { ADMIN_STATUS, ADMIN_VIEW, DIALOG_VIEW } from './admin.constants';
import {
  createCustomerUser,
  deleteCustomerUser,
  fetchCustomer,
  fetchCustomerUsers,
  inviteCustomerUser,
  selectActiveUsers,
  selectAvailableLicences,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
  selectOneAdminRemaining,
  selectPendingUsers,
  updateCustomer,
  updateCustomerUser,
} from './admin.slice';
import CorporateView from './corporate-view/corporate-view.component';
import { CreateUserForm } from './create-user-form/create-user-form.component';
import { DeleteUserForm } from './delete-user-form/delete-user-form.component';
import { EditUserForm } from './edit-user-form/edit-user-form.component';
import HomeView from './home-view/home-view.component';
import LeftSidebar from './left-sidebar/left-sidebar.component';
import { LicenceDashboard } from './licence-dashboard/licence-dashboard.component';
import OrganisationMenu from './organisation-menu/organisation-menu.component';
import { WithdrawUserInvitationForm } from './withdraw-invitation-form/withdraw-user-invitation-form.component';

const DialogCloseButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
});

const Admin = ({ user }) => {
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licenceInformation = useSelector(selectLicenceInformation);
  const availableLicences = useSelector(selectAvailableLicences);
  const activeUsers = useSelector(selectActiveUsers);
  const pendingUsers = useSelector(selectPendingUsers);
  const oneAdminRemaining = useSelector(selectOneAdminRemaining);
  const [visiblePanel, setVisiblePanel] = useState(ADMIN_VIEW.home);
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

  const quickViewData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  const getMainView = () => {
    switch (visiblePanel) {
      case ADMIN_VIEW.corporateAccount:
        return (
          <CorporateView
            user={user}
            customer={currentCustomer}
            updateCustomer={data => dispatch(updateCustomer(data))}
            updateAdministrator={data => dispatch(updateUser(data))}
          />
        );
      case ADMIN_VIEW.licenceDashboard:
        return <LicenceDashboard licenceInformation={licenceInformation} />;
      case ADMIN_VIEW.home:
      default:
        return (
          <HomeView
            currentUser={user}
            activeUsers={activeUsers}
            pendingUsers={pendingUsers}
            oneAdminRemaining={oneAdminRemaining}
            quickViewData={quickViewData}
            customer={currentCustomer}
            onChangeRoleClick={user =>
              dispatch(
                updateCustomerUser({
                  ...user,
                  type:
                    user.type === ADMIN_STATUS.manager
                      ? ADMIN_STATUS.member
                      : ADMIN_STATUS.manager,
                }),
              )
            }
            onEditUserClick={user =>
              setDialogForm({ type: DIALOG_VIEW.editUser, user })
            }
            onDeleteUserClick={user =>
              setDialogForm({ type: DIALOG_VIEW.deleteUser, user })
            }
            onResendInvitationClick={user => dispatch(inviteCustomerUser(user))}
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
            withdrawInvitation={user => {
              dispatch(deleteCustomerUser(user));
              setDialogForm(null);
            }}
            onCancelClick={() => setDialogForm(null)}
          />
        );
      case DIALOG_VIEW.editUser:
        return (
          <EditUserForm
            user={dialogForm.user}
            customer={currentCustomer}
            availableLicences={availableLicences}
            oneAdminRemaining={oneAdminRemaining}
            editUser={editedUser => {
              dispatch(updateCustomerUser(editedUser));
              setDialogForm(null);
            }}
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
    <Box display="flex" height="100vh" width="100%" overflow="hidden">
      <LeftSidebar
        user={user}
        setVisiblePanel={setVisiblePanel}
        visiblePanel={visiblePanel}
      />
      <ThemeProvider theme="light">
        <Box width="100%" overflow="auto" p={3}>
          {getMainView()}
        </Box>
        <Slide
          direction="left"
          in={visiblePanel !== ADMIN_VIEW.corporateAccount}
          unmountOnExit
        >
          <OrganisationMenu
            customer={currentCustomer}
            setVisiblePanel={setVisiblePanel}
            onCreateUserClick={() =>
              setDialogForm({ type: DIALOG_VIEW.createUser })
            }
          />
        </Slide>
        <Dialog
          open={!!dialogForm}
          onClose={() => setDialogForm(null)}
          maxWidth="md"
        >
          <DialogCloseButton
            onClick={() => setDialogForm(null)}
            aria-label="Close"
          >
            <CloseIcon />
          </DialogCloseButton>
          <DialogTitle>{dialogForm?.type}</DialogTitle>
          <DialogContent>{getDialogForm()}</DialogContent>
        </Dialog>
      </ThemeProvider>
    </Box>
  );
};

export default Admin;
