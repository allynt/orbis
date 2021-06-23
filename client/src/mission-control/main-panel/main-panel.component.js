import React from 'react';

import { VIEWS } from '../mission-control.constants';
import UsersView from './main-panel-views/users-view/users-view.component';

export const MainPanel = ({
  user,
  mainPanelView,
  activeUsers,
  pendingUsers,
  oneAdminRemaining,
  quickViewData,
  customer,
  onChangeRoleClick,
  onCreateUserClick,
  onEditUserClick,
  onDeleteUserClick,
  onResendInvitationClick,
  onWithdrawInvitationClick,
}) => {
  switch (mainPanelView) {
    case VIEWS.users:
      return (
        <UsersView
          currentUser={user}
          activeUsers={activeUsers}
          pendingUsers={pendingUsers}
          oneAdminRemaining={oneAdminRemaining}
          quickViewData={quickViewData}
          customer={customer}
          onChangeRoleClick={onChangeRoleClick}
          onCreateUserClick={onCreateUserClick}
          onEditUserClick={onEditUserClick}
          onDeleteUserClick={onDeleteUserClick}
          onResendInvitationClick={onResendInvitationClick}
          onWithdrawInvitationClick={onWithdrawInvitationClick}
        />
      );
    case VIEWS.other:
      return <h1>I am another view</h1>;
    default:
      return undefined;
  }
};
