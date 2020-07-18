import React from 'react';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

import { USER_STATUS } from '../admin.constants';

import styles from './home-view.module.css';

const HomeView = ({
  currentUser,
  users,
  customer,
  onChangeRoleClick,
  onWithdrawInvitationClick,
  onEditUserClick,
  onDeleteUserClick,
}) => {
  const activeUsers = users?.filter(user => user.status === USER_STATUS.active);
  const pendingUsers = users?.filter(
    user => user.status === USER_STATUS.pending,
  );

  let availableLicences = null;
  if (customer && customer.licences) {
    availableLicences = customer.licences.filter(
      licence => !licence.customer_user,
    );
  }

  const licenceData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  return (
    <div className={styles.home}>
      <ActiveUsersBoard
        currentUser={currentUser}
        activeUsers={activeUsers}
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
