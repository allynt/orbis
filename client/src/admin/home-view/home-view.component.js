import React from 'react';

import ActiveUsersBoard from './active-users/active-users-board.component';
import PendingInvitationsBoard from './pending-invitations/pending-invitations-board.component';

import { USER_STATUS } from '../admin.constants';

import styles from './home-view.module.css';

const HomeView = ({ users }) => (
  <div className={styles.homeView}>
    <ActiveUsersBoard activeUsers={users?.filter(user => user.status === USER_STATUS.active)} />
    <PendingInvitationsBoard pendingUsers={users?.filter(user => user.status === USER_STATUS.pending)} />
  </div>
);

export default HomeView;
