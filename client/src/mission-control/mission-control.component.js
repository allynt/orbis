import React, { useEffect, useCallback } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { userSelector } from '../accounts/accounts.selectors';
import {
  fetchCustomer,
  fetchCustomerUsers,
  selectCurrentCustomer,
  selectCustomerUsers,
} from './mission-control.slice.js';
import { useFadeTransitionProps } from './shared-components/useFadeTransitionProps';
import { SidePanel } from './side-panel/side-panel.component';
import AccountDetails from './views/account-details/account-details.component';
import savedDocumentsView from './views/saved-documents/saved-documents.component';
import { Store } from './views/store/store.component';
import ConnectedSubscriptions from './views/subscriptions/subscriptions.component';
import { Support } from './views/support/support.component';
import UsersView from './views/users-view/users-view.component';

const useDialogStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
  content: {
    height: '100%',
    padding: theme.spacing(2.5),
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
  const location = useLocation();
  const fadeTransitionProps = useFadeTransitionProps(location.key);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const userIsAdmin = user?.customers.some(
    customer => customer.type === 'MANAGER',
  );

  const dialogStyles = useDialogStyles({});
  const titleStyles = useTitleStyles({});

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

  const renderAdminOnly = useCallback(
    Component => routeProps =>
      userIsAdmin ? (
        <Component {...routeProps} />
      ) : (
        <Redirect to="/mission-control" />
      ),
    [userIsAdmin],
  );

  const handleClose = () => {
    return dispatch(push('/map'));
  };

  return (
    <Dialog
      open={location.pathname.includes('/mission-control')}
      classes={dialogStyles}
      maxWidth="xl"
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle classes={titleStyles}>{`Hello ${user?.name}`}</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={4}
          wrap="nowrap"
          className={dialogStyles.content}
        >
          <Grid item xs={4} lg={2}>
            <SidePanel userIsAdmin={userIsAdmin} />
          </Grid>
          <Grid item xs={8} lg={10}>
            <TransitionGroup style={{ position: 'relative' }}>
              <CSSTransition {...fadeTransitionProps}>
                <Switch location={location}>
                  <Route
                    path="/mission-control/store"
                    render={renderAdminOnly(Store)}
                  />
                  <Route
                    path="/mission-control/saved-documents"
                    component={savedDocumentsView}
                  />
                  <Route
                    path="/mission-control/users"
                    render={renderAdminOnly(UsersView)}
                  />
                  <Route
                    path="/mission-control/subscriptions"
                    render={renderAdminOnly(ConnectedSubscriptions)}
                  />
                  <Route path="/mission-control/support" component={Support} />
                  <Route
                    path="/mission-control/account-details"
                    render={renderAdminOnly(AccountDetails)}
                  />
                  <Route exact path="/mission-control">
                    <Redirect to="/mission-control/support" />
                  </Route>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
