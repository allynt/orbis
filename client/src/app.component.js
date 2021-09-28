import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Accounts from 'accounts';
import apiClient from 'api-client';
import { LoadMaskFallback } from 'components';
import LandingView from 'landing/landing.component';

import { userKeySelector, userSelector } from './accounts/accounts.selectors';
import { fetchCurrentUser } from './accounts/accounts.slice';
import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
} from './app.slice';
import PrivateRoute from './utils/private-route.component';

const MapLayout = React.lazy(() =>
  import(/* webpackChunkName: "MapLayout" */ 'map'),
);

const App = () => {
  const dispatch = useDispatch();
  const userTrackingInterval = useSelector(userTrackingIntervalSelector);
  const fetchUserRequestStatus = useSelector(
    state => state.accounts.requests.fetchCurrentUser,
  );

  const user = useSelector(userSelector);
  const userKey = useSelector(userKeySelector);

  // Always fetch app config regardless of logged in status
  useEffect(() => {
    dispatch(fetchAppConfig());
  }, [dispatch]);

  // If page refreshed, ensure we try to retrieve the logged in user.
  // Also, only fetch user if userKey is present
  useEffect(() => {
    if (userKey && !user) {
      apiClient.userKey = userKey;
      dispatch(fetchCurrentUser());
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

  if (fetchUserRequestStatus === 'pending') return <LoadMaskFallback />;

  return (
    <Box width="100vw" height="100vh">
      <ReactTooltip />
      <React.Suspense fallback={<LoadMaskFallback />}>
        <Switch>
          <PrivateRoute exact path="/" user={user} component={LandingView} />
          <Route path="/accounts" component={Accounts} />
          <PrivateRoute
            path={['/map', '/mission-control']}
            user={user}
            component={MapLayout}
          />
        </Switch>
      </React.Suspense>
    </Box>
  );
};

export default App;
