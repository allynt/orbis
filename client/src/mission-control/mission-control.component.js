import React, { useState, useEffect } from 'react';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  CloseIcon,
  IconButton,
  styled,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { userSelector } from '../accounts/accounts.selectors';
import { VIEWS, ADMIN_STATUS, DIALOG_VIEW } from './mission-control.constants';
import { MainPanel } from './main-panel/main-panel.component';
import { SidePanel } from './side-panel/side-panel.component';

import { updateUser } from '../accounts/accounts.slice';

import {
  CreateUserForm,
  DeleteUserForm,
  EditUserForm,
  WithdrawUserInvitationForm,
} from './mission-control-forms';

import {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
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
} from './mission-control-slice.js';

const useDialogStyles = makeStyles(theme => ({
  paper: {
    width: `calc(100% - ${theme.typography.pxToRem(96)})`,
    height: `calc(100% - ${theme.typography.pxToRem(96)})`,
    margin: '0',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
}));

const useTitleStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    '& > *': {
      color: theme.palette.common.white,
    },
  },
}));

const DialogCloseButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
});

export const MissionControl = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(selectIsMissionControlDialogVisible);
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licenceInformation = useSelector(selectLicenceInformation);
  const availableLicences = useSelector(selectAvailableLicences);
  const activeUsers = useSelector(selectActiveUsers);
  const pendingUsers = useSelector(selectPendingUsers);
  const oneAdminRemaining = useSelector(selectOneAdminRemaining);
  const [dialogForm, setDialogForm] = useState(null);

  const dialogStyles = useDialogStyles({});
  const titleStyles = useTitleStyles();

  const quickViewData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  const [mainPanelView, setMainPanelView] = useState(VIEWS.users);

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

  const handleClose = () => {
    return dispatch(toggleMissionControlDialog(false));
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
    <Dialog
      open={isVisible}
      classes={dialogStyles}
      maxWidth={false}
      onBackdropClick={handleClose}
    >
      <DialogTitle classes={titleStyles}>{`Hello ${user?.name}`}</DialogTitle>
      <DialogContent>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <SidePanel
              mainPanelView={mainPanelView}
              setMainPanelView={setMainPanelView}
            />
          </Grid>
          <Grid item>
            <MainPanel
              user={user}
              mainPanelView={mainPanelView}
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
              onCreateUserClick={() =>
                setDialogForm({ type: DIALOG_VIEW.createUser })
              }
              onEditUserClick={user =>
                setDialogForm({ type: DIALOG_VIEW.editUser, user })
              }
              onDeleteUserClick={user =>
                setDialogForm({ type: DIALOG_VIEW.deleteUser, user })
              }
              onResendInvitationClick={user =>
                dispatch(inviteCustomerUser(user))
              }
              onWithdrawInvitationClick={user =>
                setDialogForm({ type: DIALOG_VIEW.withdrawInvitation, user })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
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
    </Dialog>
  );
};
