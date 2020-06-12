import React, { useEffect, useRef, lazy, Suspense } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import PrivateRoute from './utils/private-route.component';

import { fetchAppConfig } from './app.slice';
import { fetchUser } from './accounts/accounts.slice';

import { fetchUserCustomers, createUser, deleteUser, updateUser, copyUser } from './accounts/admin/users.slice';

import { fetchSources, selectPollingPeriod } from './data-layers/data-layers.slice';

import Accounts from './accounts';
import TermsAndConditions from './accounts/terms-and-conditions.component';
import UpdateUserForm from './accounts/update-user-form.component';

import LandingView from './landing/landing.component';

import MapLayout from './map';

import styles from './app.module.css';

const Admin = lazy(() => import('./accounts/admin/admin.component'));

const App = () => {
  const dispatch = useDispatch();
  const trackingId = useSelector(state =>
    state && state.app && state.app.config ? state.app.config.trackingId : null,
  );

  const userCustomers = useSelector(state => state.admin.userCustomers);
  const user = useSelector(state => state.accounts.user);
  const userKey = useSelector(state => state.accounts.userKey);
  const pollingPeriod = useSelector(selectPollingPeriod);
  const notYetImplementedDescription = useSelector(state => state.app.notYetImplementedDescription);
  const ref = useRef(null);
  const [isVisible, toggle] = useModal(notYetImplementedDescription !== null ? true : false);

  const userExists = user ? true : false;

  useEffect(() => {
    if (notYetImplementedDescription !== null) {
      toggle();
    }
  }, [notYetImplementedDescription, toggle]);

  // Always fetch app config regardless of logged in status
  useEffect(() => {
    dispatch(fetchAppConfig());
  }, [dispatch]);

  // If page refreshed, ensure we try to retrieve the logged in user.
  // Also, only fetch user if userKey is present
  useEffect(() => {
    if (userKey && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, userKey]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserCustomers(user));
    }
  }, [dispatch, user]);

  // If the Google Analytics tracking id doesn't exist, fetch it,
  // then setup analytics. This should only be done once on app
  // startup.
  useEffect(() => {
    if (trackingId) {
      ReactGA.initialize(trackingId);
      // ReactGA.initialize(trackingId, { debug: true });
      ReactGA.pageview('/', null, 'ORBIS App');
    }
  }, [dispatch, trackingId]);

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    // console.log('Initial Request for sources');
    if (userExists) {
      dispatch(fetchSources());

      const interval = setInterval(() => {
        dispatch(fetchSources());
      }, pollingPeriod);
      return () => {
        clearInterval(interval);
      };
    }
  }, [userExists, pollingPeriod, dispatch]);

  return (
    <div className={styles.app} ref={ref}>
      <ReactTooltip />

      <main>
        <Dialog isVisible={isVisible} title="Sorry, Not Ready Yet!" close={toggle} ref={ref}>
          <p className={styles.paragraph}>
            Sorry for the inconvenience, but this feature is not available yet! Do not worry, we will let you know when
            it will be ready.
          </p>
        </Dialog>

        <Switch>
          <PrivateRoute exact path="/" user={user} component={LandingView} />
          <Route path="/accounts" component={Accounts} />
          <PrivateRoute path="/map" user={user} component={MapLayout} />
          <PrivateRoute exact path="/user/update" user={user} component={UpdateUserForm} />
          <Route exact path="/terms" component={TermsAndConditions} />
          <Suspense fallback={<h3>Loading...</h3>}>
            <PrivateRoute
              exact
              path="/admin"
              user={user}
              component={Admin}
              userCustomers={userCustomers}
              createUser={user => dispatch(createUser(user))}
              updateUser={user => dispatch(updateUser(user))}
              copyUser={user => dispatch(copyUser(user))}
              deleteUser={id => dispatch(deleteUser(id))}
            />
          </Suspense>
        </Switch>
      </main>
    </div>
  );
};

export default App;
