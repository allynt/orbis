import React from 'react';

import { ActiveUsersBoard } from './active-users-board/active-users-board.component';
import { PendingInvitationsBoard } from './pending-invitations-board/pending-invitations-board.component';

import { USER_STATUS } from '../admin.constants';

import styles from './home-view.module.css';

const HomeView = ({ users, customer }) => (
  <div className={styles.home}>
    <ActiveUsersBoard activeUsers={users?.filter(user => user.status === USER_STATUS.active)} customer={customer} />
    <PendingInvitationsBoard
      pendingUsers={users?.filter(user => user.status === USER_STATUS.pending)}
      customer={customer}
    />
  </div>
);

export default HomeView;
