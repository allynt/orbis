import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  CloseIcon,
  IconButton,
  styled,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { userSelector } from 'accounts/accounts.selectors';
import {
  DIALOG_VIEW,
  ADMIN_STATUS,
} from 'mission-control//mission-control.constants';
import {
  inviteCustomerUser,
  selectActiveUsers,
  selectAvailableLicences,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
  selectOneAdminRemaining,
  selectPendingUsers,
  updateCustomerUser,
  createCustomerUser,
  deleteCustomerUser,
} from 'mission-control/mission-control.slice.js';
import { Heading } from 'mission-control/shared-components/heading.component';
import { Wrapper } from 'mission-control/shared-components/wrapper.component';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import {
  CreateUserForm,
  DeleteUserForm,
  EditUserForm,
  WithdrawUserInvitationForm,
} from './forms';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

const DialogCloseButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
});

const UsersView = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const availableLicences = useSelector(selectAvailableLicences);
  const licenceInformation = useSelector(selectLicenceInformation);
  const activeUsers = useSelector(selectActiveUsers);
  const pendingUsers = useSelector(selectPendingUsers);
  const oneAdminRemaining = useSelector(selectOneAdminRemaining);
  const [dialogForm, setDialogForm] = useState(null);

  const quickViewData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  /** @param { import('typings').CustomerUser } user */
  const onChangeRoleClick = user =>
    dispatch(
      updateCustomerUser({
        ...user,
        type:
          user.type === ADMIN_STATUS.manager
            ? ADMIN_STATUS.member
            : ADMIN_STATUS.manager,
      }),
    );

  const onCreateUserClick = () =>
    setDialogForm({ type: DIALOG_VIEW.createUser });

  /** @param { import('typings').CustomerUser } user */
  const onEditUserClick = user =>
    setDialogForm({ type: DIALOG_VIEW.editUser, user });

  /** @param { import('typings').CustomerUser } user */
  const onDeleteUserClick = user =>
    setDialogForm({
      type: DIALOG_VIEW.deleteUser,
      user,
    });

  /** @param { import('typings').CustomerUser } user */
  const onResendInvitationClick = user => dispatch(inviteCustomerUser(user));

  /** @param { import('typings').CustomerUser } user */
  const onWithdrawInvitationClick = user =>
    setDialogForm({
      type: DIALOG_VIEW.withdrawInvitation,
      user,
    });

  /**
   * @param {{
   * email: string;
   * name?: string;
   * licences: string[];
   * }} values
   */
  const handleCreateUserFormSubmit = values => {
    setDialogForm(null);
    dispatch(createCustomerUser(values));
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
    <>
      <Wrapper maxWidth={false}>
        <Heading>Users</Heading>
        <ActiveUsersBoard
          currentUser={user}
          activeCustomerUsers={activeUsers}
          oneAdminRemaining={oneAdminRemaining}
          customer={currentCustomer}
          quickViewData={quickViewData}
          onChangeRoleClick={onChangeRoleClick}
          onCreateUserClick={onCreateUserClick}
          onEditUserClick={onEditUserClick}
          onDeleteUserClick={onDeleteUserClick}
        />
      </Wrapper>
      <Wrapper maxWidth={false}>
        <Heading>Pending Invitations</Heading>
        <PendingInvitationsBoard
          pendingUsers={pendingUsers}
          customer={currentCustomer}
          onResendInvitationClick={onResendInvitationClick}
          onWithdrawInvitationClick={onWithdrawInvitationClick}
        />
      </Wrapper>
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
    </>
  );
};

export default UsersView;
