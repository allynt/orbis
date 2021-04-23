import React, { lazy, Suspense, useEffect, useRef } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import apiClient from 'api-client';
import Accounts from './accounts';
import { userSelector } from './accounts/accounts.selectors';
import { fetchUser } from './accounts/accounts.slice';
import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
} from './app.slice';
import LandingView from './landing/landing.component';
import MapLayout from './map';
import PrivateRoute from './utils/private-route.component';

const Admin = lazy(() => import('./admin/admin.component'));

const App = () => {
  const dispatch = useDispatch();
  const userTrackingInterval = useSelector(userTrackingIntervalSelector);

  const user = useSelector(userSelector);
  const userKey = useSelector(state => state.accounts.userKey);
  const notYetImplementedDescription = useSelector(
    state => state.app.notYetImplementedDescription,
  );
  const ref = useRef(null);
  // const [isVisible, toggle] = useModal(
  //   notYetImplementedDescription !== null ? true : false,
  // );

  // useEffect(() => {
  //   if (notYetImplementedDescription !== null) {
  //     toggle();
  //   }
  // }, [notYetImplementedDescription, toggle]);

  // Always fetch app config regardless of logged in status
  useEffect(() => {
    dispatch(fetchAppConfig());
  }, [dispatch]);

  // If page refreshed, ensure we try to retrieve the logged in user.
  // Also, only fetch user if userKey is present
  useEffect(() => {
    if (userKey && !user) {
      apiClient.userKey = userKey;
      dispatch(fetchUser());
    }
  }, [dispatch, user, userKey]);

  useEffect(() => {
    if (userTrackingInterval) {
      const userTracking = setInterval(() => {
        dispatch(logUserTracking());
      }, userTrackingInterval);

      return () => clearInterval(userTracking);
    }
  }, [dispatch, userTrackingInterval]);

  return (
    <Box
      width="100vw"
      height="100vh"
      style={{ backgroundColor: '#ffffff' }}
      ref={ref}
    >
      <ReactTooltip />
      {/* <Dialog
          isVisible={isVisible}
          title="Sorry, Not Ready Yet!"
          close={toggle}
          ref={ref}
        >
          <p className={styles.paragraph}>
            Sorry for the inconvenience, but this feature is not available yet!
            Do not worry, we will let you know when it will be ready.
          </p>
        </Dialog> */}

      <Switch>
        <PrivateRoute exact path="/" user={user} component={LandingView} />
        <Route path="/accounts" component={Accounts} />
        <PrivateRoute path="/map" user={user} component={MapLayout} />
        <Suspense fallback={<h3>Loading...</h3>}>
          <PrivateRoute
            exact
            path="/admin-console"
            user={user}
            component={Admin}
          />
        </Suspense>
      </Switch>
    </Box>
  );
};

export default App;
