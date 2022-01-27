import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Accounts from 'accounts';
import apiClient from 'api-client';
import { ErrorFallback, LoadMaskFallback } from 'components';
import LandingView from 'landing/landing.component';
import RequiresAuth from 'utils/requires-auth.component';

import { userKeySelector, userSelector } from './accounts/accounts.selectors';
import { fetchCurrentUser } from './accounts/accounts.slice';
import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
  backgroundLocationSelector,
} from './app.slice';

const MapLayout = React.lazy(() =>
  import(/* webpackChunkName: "MapLayout" */ 'map'),
);

const MissionControl = React.lazy(() =>
  import(
    /* webpackChunkName: "MissionControl" */ 'mission-control/mission-control.component'
  ),
);

const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "Dashboard" */ 'dashboard'),
);

const App = () => {
  const dispatch = useDispatch();
  const userTrackingInterval = useSelector(userTrackingIntervalSelector);
  const fetchUserRequestStatus = useSelector(
    state => state.accounts.requests.fetchCurrentUser,
  );
  const backgroundLocation = useSelector(backgroundLocationSelector);

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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ReactTooltip />
        <React.Suspense fallback={<LoadMaskFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <RequiresAuth user={user} redirectTo={'/accounts/login'}>
                  <LandingView />
                </RequiresAuth>
              }
            />
            <Route path="accounts/*" element={<Accounts />} />
            <Route
              path="map"
              element={
                <RequiresAuth user={user} redirectTo={'/accounts/login'}>
                  <MapLayout />
                </RequiresAuth>
              }
            />
            <Route
              path="dashboard"
              element={
                <RequiresAuth user={user} redirectTo={'/accounts/login'}>
                  <Dashboard />
                </RequiresAuth>
              }
            />
            {backgroundLocation && (
              <Route path="/mission-control/*" element={<MissionControl />} />
            )}
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default App;
