import React from 'react';

import { Box } from '@astrosat/astrosat-ui';

import ContentWrapper from './content-wrapper.component';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

/**
 * @typedef UsersViewProps
 * @property {import('typings/orbis').User} [currentUser]
 * @property {import('typings/orbis').CustomerUser[]} [activeUsers]
 * @property {import('typings/orbis').CustomerUser[]} [pendingUsers]
 * @property {boolean} [oneAdminRemaining]
 * @property {import('./active-users-board/quick-view/quick-view.component').QuickViewData} [quickViewData]
 * @property {import('typings/orbis').Customer} [customer]
 * @property {(customerUser: import('typings/orbis').CustomerUser) => void} [onChangeRoleClick]
 * @property {(type: string) => void} [onCreateUserClick]
 * @property {(customerUser: import('typings/orbis').CustomerUser) => void} [onEditUserClick]
 * @property {(customerUser: import('typings/orbis').CustomerUser) => void} [onResendInvitationClick]
 * @property {(customerUser: import('typings/orbis').CustomerUser) => void} [onWithdrawInvitationClick]
 * @property {(customerUser: import('typings/orbis').CustomerUser) => void} [onDeleteUserClick]
 */

/**
 * @param {UsersViewProps} props
 */
const UsersView = ({
  currentUser,
  activeUsers,
  pendingUsers,
  oneAdminRemaining,
  quickViewData,
  customer,
  onChangeRoleClick,
  onCreateUserClick,
  onEditUserClick,
  onResendInvitationClick,
  onWithdrawInvitationClick,
  onDeleteUserClick,
}) => (
  <Box display="flex" flexDirection="column" width="100%">
    <ContentWrapper title="Users">
      <ActiveUsersBoard
        currentUser={currentUser}
        activeCustomerUsers={activeUsers}
        oneAdminRemaining={oneAdminRemaining}
        customer={customer}
        quickViewData={quickViewData}
        onChangeRoleClick={onChangeRoleClick}
        onCreateUserClick={onCreateUserClick}
        onEditUserClick={onEditUserClick}
        onDeleteUserClick={onDeleteUserClick}
      />
    </ContentWrapper>
    <ContentWrapper title="Pending Invitations">
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
        onResendInvitationClick={onResendInvitationClick}
        onWithdrawInvitationClick={onWithdrawInvitationClick}
      />
    </ContentWrapper>
  </Box>
);

export default UsersView;
