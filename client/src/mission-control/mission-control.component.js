import React, { useEffect } from 'react';

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
import { Store } from './views/store/store.component';
import UsersView from './views/users-view/users-view.component';

const useDialogStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
  content: {
    padding: theme.spacing(2.5, 0, 2.5, 2.5),
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
      <DialogContent className={dialogStyles.content}>
        <Grid container wrap="nowrap">
          <Grid item xs={4} lg={2}>
            <SidePanel userIsAdmin={userIsAdmin} />
          </Grid>
          <Grid item xs={8} lg={10}>
            <TransitionGroup style={{ position: 'relative' }}>
              <CSSTransition {...fadeTransitionProps}>
                <Switch location={location}>
                  <Route
                    path="/mission-control/store"
                    render={routeProps =>
                      userIsAdmin ? (
                        <Store {...routeProps} />
                      ) : (
                        <Redirect to="/mission-control" />
                      )
                    }
                  />
                  <Route path="/mission-control/users" component={UsersView} />
                  <Route
                    path="/mission-control/other"
                    component={() => <h1>Other Route</h1>}
                  />
                  <Route exact path="/mission-control">
                    <Redirect to="/mission-control/users" />
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
