import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { backgroundLocationSelector, setBackgroundLocation } from 'app.slice';
import { ErrorFallback } from 'components';
import RequiresAdmin from 'utils/requires-admin.component';

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
  const navigate = useNavigate();

  const fadeTransitionProps = useFadeTransitionProps(location.key);
  const dispatch = useDispatch();
  const styles = useStyles();

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

  if (location.pathname === '/mission-control') {
    return <Navigate to="/mission-control/support" />;
  }

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
          navigate(
            `${backgroundLocation?.pathname}${backgroundLocation?.search}`,
          );
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
                <Routes>
                  <Route
                    path="/store/*"
                    element={
                      <RequiresAdmin user={user} redirectTo="/mission-control">
                        <Store />
                      </RequiresAdmin>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <RequiresAdmin user={user} redirectTo="/mission-control">
                        <UsersView />
                      </RequiresAdmin>
                    }
                  />
                  <Route
                    path="/subscriptions"
                    element={
                      <RequiresAdmin user={user} redirectTo="/mission-control">
                        <ConnectedSubscriptions />
                      </RequiresAdmin>
                    }
                  />
                  <Route
                    path="/saved-documents"
                    element={<SavedDocumentsView />}
                  />
                  <Route path="/support" element={<Support />} />
                  <Route
                    path="/account-details"
                    element={
                      <RequiresAdmin user={user} redirectTo="/mission-control">
                        <AccountDetails />
                      </RequiresAdmin>
                    }
                  />
                  <Route path="/storage" element={<Storage />} />
                </Routes>
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
