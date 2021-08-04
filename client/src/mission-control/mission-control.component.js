import React, { useState, useEffect } from 'react';

import { Grid, Dialog, DialogTitle, makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { userSelector } from '../accounts/accounts.selectors';
import { VIEWS } from './mission-control.constants';
import {
  toggleMissionControlDialog,
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
} from './mission-control.slice.js';
import { SidePanel } from './side-panel/side-panel.component';
import UsersView from './views/users-view/users-view.component';

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

const useContentStyles = makeStyles(theme => ({
  root: {
    padding: 'none',
  },
  mainPanel: {
    width: '100%',
    margin: '1.25rem',
  },
  sidePanel: {
    margin: '1.25rem 0 1.25rem 1.25rem',
  },
}));

export const MissionControl = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);

  const dialogStyles = useDialogStyles({});
  const titleStyles = useTitleStyles({});
  const contentStyles = useContentStyles({});

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
      open={location.pathname.includes('/mission-control')}
      classes={dialogStyles}
      maxWidth={false}
      onBackdropClick={handleClose}
    >
      <DialogTitle classes={titleStyles}>{`Hello ${user?.name}`}</DialogTitle>
      <Grid container direction="row" justify="space-between" wrap="nowrap">
        <Grid item className={contentStyles.sidePanel}>
          <SidePanel
            mainPanelView={mainPanelView}
            setMainPanelView={setMainPanelView}
          />
        </Grid>
        <Grid item className={contentStyles.mainPanel}>
          {mainPanelView === VIEWS.users ? (
            <UsersView />
          ) : (
            <h1>I am another view</h1>
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
};
