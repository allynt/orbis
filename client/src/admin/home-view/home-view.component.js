import React from 'react';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

import styles from './home-view.module.css';

const HomeView = ({
  currentUser,
  activeUsers,
  pendingUsers,
  oneAdminRemaining,
  licenceData,
  customer,
  onChangeRoleClick,
  onEditUserClick,
  onWithdrawInvitationClick,
  onDeleteUserClick,
}) => {
  return (
    <div className={styles.home}>
      <ActiveUsersBoard
        currentUser={currentUser}
        activeUsers={activeUsers}
        oneAdminRemaining={oneAdminRemaining}
        customer={customer}
        licenceData={licenceData}
        onChangeRoleClick={onChangeRoleClick}
        onEditUserClick={onEditUserClick}
        onDeleteUserClick={onDeleteUserClick}
      />
      <PendingInvitationsBoard
        pendingUsers={pendingUsers}
        customer={customer}
        onWithdrawInvitationClick={onWithdrawInvitationClick}
      />
    </div>
  );
};

export default HomeView;
