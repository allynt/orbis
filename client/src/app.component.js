import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import apiClient from 'api-client';

import Accounts from './accounts';
import { userKeySelector, userSelector } from './accounts/accounts.selectors';
import { fetchCurrentUser } from './accounts/accounts.slice';
import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
} from './app.slice';
import LandingView from './landing/landing.component';
import MapLayout from './map';
import PrivateRoute from './utils/private-route.component';

const App = () => {
  const dispatch = useDispatch();
  const userTrackingInterval = useSelector(userTrackingIntervalSelector);

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

  return (
    <Box width="100vw" height="100vh" style={{ backgroundColor: '#ffffff' }}>
      <ReactTooltip />

      <Switch>
        <PrivateRoute exact path="/" user={user} component={LandingView} />
        <Route path="/accounts" component={Accounts} />
        <PrivateRoute
          path={['/map', '/mission-control']}
          user={user}
          component={MapLayout}
        />
      </Switch>
    </Box>
  );
};

export default App;
