import React from 'react';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

import styles from './home-view.module.css';

const HomeView = ({
  currentUser,
  activeUsers,
  pendingUsers,
  oneAdminRemaining,
  quickViewData,
  customer,
  onChangeRoleClick,
  onEditUserClick,
  onResendInvitationClick,
  onWithdrawInvitationClick,
  onDeleteUserClick,
}) => (
  <div className={styles.home}>
    <ActiveUsersBoard
      currentUser={currentUser}
      activeCustomerUsers={activeUsers}
      oneAdminRemaining={oneAdminRemaining}
      customer={customer}
      quickViewData={quickViewData}
      onChangeRoleClick={onChangeRoleClick}
      onEditUserClick={onEditUserClick}
      onDeleteUserClick={onDeleteUserClick}
    />
    <PendingInvitationsBoard
      pendingUsers={pendingUsers}
      customer={customer}
      onResendInvitationClick={onResendInvitationClick}
      onWithdrawInvitationClick={onWithdrawInvitationClick}
    />
  </div>
);

export default HomeView;
