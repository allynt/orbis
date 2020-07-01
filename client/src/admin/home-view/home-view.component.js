import React from 'react';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

import { USER_STATUS } from '../admin.constants';

import styles from './home-view.module.css';

const HomeView = ({ users, customer }) => {
  const activeUsers = users?.filter(user => user.status === USER_STATUS.active);
  const pendingUsers = users?.filter(user => user.status === USER_STATUS.pending);
  const availableLicences = customer?.licences.filter(licence => !licence.customer_user);

  const licenceData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  return (
    <div className={styles.home}>
      <ActiveUsersBoard activeUsers={activeUsers} customer={customer} licenceData={licenceData} />
      <PendingInvitationsBoard pendingUsers={pendingUsers} customer={customer} />
    </div>
  );
};

export default HomeView;
