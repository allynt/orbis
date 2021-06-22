import React, { useState, useEffect } from 'react';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
} from 'mission-control/mission-control-slice';

import { userSelector } from '../accounts/accounts.selectors';
import { VIEWS, ADMIN_STATUS, DIALOG_VIEW } from './mission-control.constants';
import { MainPanel } from './main-panel/main-panel.component';
import { SidePanel } from './side-panel/side-panel.component';

import { updateUser } from '../accounts/accounts.slice';

import {
  createCustomerUser,
  deleteCustomerUser,
  fetchCustomer,
  fetchCustomerUsers,
  inviteCustomerUser,
  selectActiveUsers,
  selectAvailableLicences,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
  selectOneAdminRemaining,
  selectPendingUsers,
  updateCustomer,
  updateCustomerUser,
} from './mission-control-slice.js';

const useDialogStyles = makeStyles(theme => ({
  paper: {
    width: `calc(100% - ${theme.typography.pxToRem(96)})`,
    height: `calc(100% - ${theme.typography.pxToRem(96)})`,
    margin: '0',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
}));

const useTitleStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    '& > *': {
      color: theme.palette.common.white,
    },
  },
}));

export const MissionControl = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector(selectIsMissionControlDialogVisible);
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const licenceInformation = useSelector(selectLicenceInformation);
  const availableLicences = useSelector(selectAvailableLicences);
  const activeUsers = useSelector(selectActiveUsers);
  const pendingUsers = useSelector(selectPendingUsers);
  const oneAdminRemaining = useSelector(selectOneAdminRemaining);
  const [visiblePanel, setVisiblePanel] = useState(VIEWS.users);
  const [dialogForm, setDialogForm] = useState(null);

  const dialogStyles = useDialogStyles({});
  const titleStyles = useTitleStyles();

  const quickViewData = {
    active: activeUsers?.length,
    pending: pendingUsers?.length,
    available: availableLicences?.length,
  };

  const [mainPanelView, setMainPanelView] = useState(VIEWS.users);

  useEffect(() => {
    if (!currentCustomer) {
      dispatch(fetchCustomer(user));
    }
  }, [user, currentCustomer, dispatch]);

  useEffect(() => {
    if (currentCustomer && !customerUsers) {
      dispatch(fetchCustomerUsers(currentCustomer));
    }
  }, [currentCustomer, customerUsers, dispatch]);

  const handleClose = () => {
    return dispatch(toggleMissionControlDialog(false));
  };

  return (
    <Dialog
      open={isVisible}
      classes={dialogStyles}
      maxWidth={false}
      onBackdropClick={handleClose}
    >
      <DialogTitle classes={titleStyles}>{`Hello ${user?.name}`}</DialogTitle>
      <DialogContent>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <SidePanel
              mainPanelView={mainPanelView}
              setMainPanelView={setMainPanelView}
            />
          </Grid>
          <Grid item>
            <MainPanel
              user={user}
              mainPanelView={mainPanelView}
              activeUsers={activeUsers}
              pendingUsers={pendingUsers}
              oneAdminRemaining={oneAdminRemaining}
              quickViewData={quickViewData}
              customer={currentCustomer}
              onChangeRoleClick={user =>
                dispatch(
                  updateCustomerUser({
                    ...user,
                    type:
                      user.type === ADMIN_STATUS.manager
                        ? ADMIN_STATUS.member
                        : ADMIN_STATUS.manager,
                  }),
                )
              }
              onEditUserClick={user =>
                setDialogForm({ type: DIALOG_VIEW.editUser, user })
              }
              onDeleteUserClick={user =>
                setDialogForm({ type: DIALOG_VIEW.deleteUser, user })
              }
              onResendInvitationClick={user =>
                dispatch(inviteCustomerUser(user))
              }
              onWithdrawInvitationClick={user =>
                setDialogForm({ type: DIALOG_VIEW.withdrawInvitation, user })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
