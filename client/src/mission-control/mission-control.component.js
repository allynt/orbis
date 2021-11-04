import React, { useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { push } from 'connected-react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { backgroundLocationSelector, setBackgroundLocation } from 'app.slice';
import { ErrorFallback } from 'components';

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
import SavedDocumentsView from './views/saved-documents/saved-documents.component';
import { default as Storage } from './views/storage/storage.component';
import { Store } from './views/store/store.component';
import ConnectedSubscriptions from './views/subscriptions/subscriptions.component';
import { Support } from './views/support/support.component';
import UsersView from './views/users-view/users-view.component';

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
  title: {
    placeItems: 'revert',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    padding: 0,
  },
  sidePanel: { padding: theme.spacing(2, 4) },
  main: {
    '&$outer': { position: 'relative', width: '100%', height: '100%' },
    '&$inner': {
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      padding: theme.spacing(2, 4),
    },
  },
  outer: {},
  inner: {},
}));

export const MissionControl = React.memo(() => {
  const location = useLocation();
  const match = useRouteMatch();
  const fadeTransitionProps = useFadeTransitionProps(location.key);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerUsers = useSelector(selectCustomerUsers);
  const backgroundLocation = useSelector(backgroundLocationSelector);
  const userIsAdmin = user?.customers.some(
    customer => customer.type === 'MANAGER',
  );
  const [open, setOpen] = useState(
    location.pathname.includes('/mission-control'),
  );

  const styles = useStyles({});

  useEffect(() => {
    if (!currentCustomer) {
      dispatch(fetchCustomer(user));
    }
  }, [user, currentCustomer, dispatch]);

  useEffect(() => {
    if (userIsAdmin && currentCustomer && !customerUsers) {
      dispatch(fetchCustomerUsers(currentCustomer));
    }
  }, [currentCustomer, customerUsers, dispatch, userIsAdmin]);

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
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      classes={{
        paper: styles.paper,
      }}
      maxWidth="xl"
      fullWidth
      onClose={handleClose}
      keepMounted={false}
      TransitionProps={{
        onExited: () => {
          dispatch(push(backgroundLocation.pathname));
          dispatch(setBackgroundLocation(null));
        },
      }}
    >
      <DialogTitle classes={{ root: styles.title }}>
        {`Hello ${user?.name}`}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <SidePanel className={styles.sidePanel} userIsAdmin={userIsAdmin} />
        <TransitionGroup className={`${styles.main} ${styles.outer}`}>
          <CSSTransition {...fadeTransitionProps}>
            <div className={`${styles.main} ${styles.inner}`}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Switch>
                  <Route
                    path={`${match.path}/store`}
                    render={renderAdminOnly(Store)}
                  />
                  <Route
                    path={`${match.path}/users`}
                    render={renderAdminOnly(UsersView)}
                  />
                  <Route
                    path={`${match.path}/subscriptions`}
                    render={renderAdminOnly(ConnectedSubscriptions)}
                  />
                  <Route
                    path={`${match.path}/saved-documents`}
                    component={SavedDocumentsView}
                  />
                  <Route path={`${match.path}/support`} component={Support} />
                  <Route
                    path={`${match.path}/account-details`}
                    render={renderAdminOnly(AccountDetails)}
                  />
                  <Route path={`${match.path}/storage`} component={Storage} />
                  <Route exact path="/mission-control">
                    <Redirect to={`${match.path}/support`} />
                  </Route>
                </Switch>
              </ErrorBoundary>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </DialogContent>
    </Dialog>
  );
});
MissionControl.displayName = 'MissionControl';

export default MissionControl;
