import React, { useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from '@astrosat/astrosat-ui';

import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import apiClient from 'api-client';

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
import { Store } from './views/store/store.component';
import ConnectedSubscriptions from './views/subscriptions/subscriptions.component';
import { Support } from './views/support/support.component';
import UsersView from './views/users-view/users-view.component';

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.typography.pxToRem(16),
  },
  title: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
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
  const [documents, setDocuments] = useState([]);

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

  useEffect(() => {
    const fetchDocs = async () => {
      const docs = await apiClient.documents.getAgreedDocuments();
      setDocuments(docs);
    };
    fetchDocs();
  }, []);

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
      classes={styles}
      maxWidth="xl"
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle classes={{ root: styles.title }} disableTypography>
        <Typography variant="h1">{`Hello ${user?.name}`}</Typography>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <SidePanel className={styles.sidePanel} userIsAdmin={userIsAdmin} />
        <TransitionGroup className={`${styles.main} ${styles.outer}`}>
          <CSSTransition {...fadeTransitionProps}>
            <div className={`${styles.main} ${styles.inner}`}>
              <Switch location={location}>
                <Route
                  path="/mission-control/store"
                  render={renderAdminOnly(Store)}
                />
                <Route
                  path="/mission-control/users"
                  render={renderAdminOnly(UsersView)}
                />
                <Route
                  path="/mission-control/subscriptions"
                  render={renderAdminOnly(ConnectedSubscriptions)}
                />
                <Route
                  path="/mission-control/saved-documents"
                  render={() => <SavedDocumentsView documents={documents} />}
                />
                <Route path="/mission-control/support" component={Support} />
                <Route
                  path="/mission-control/account-details"
                  render={renderAdminOnly(AccountDetails)}
                />
                <Route exact path="/mission-control">
                  <Redirect to="/mission-control/support" />
                </Route>
                {/* <Route path="/mission-control/storage" component={Storage} /> */}
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </DialogContent>
    </Dialog>
  );
};
