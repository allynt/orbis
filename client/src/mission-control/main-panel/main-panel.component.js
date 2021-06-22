import React from 'react';

import {
  Box,
  CloseIcon,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  styled,
  ThemeProvider,
} from '@astrosat/astrosat-ui';

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
          onEditUserClick={onEditUserClick}
          onDeleteUserClick={onDeleteUserClick}
          onResendInvitationClick={onResendInvitationClick}
          onWithdrawInvitationClick={onWithdrawInvitationClick}
        />
      );
    case VIEWS.other:
      return <h1>I am an other view</h1>;
    default:
      return undefined;
  }
};
