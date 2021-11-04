import React, { useEffect } from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Accounts from 'accounts';
import apiClient from 'api-client';
import { ErrorFallback, LoadMaskFallback } from 'components';
import LandingView from 'landing/landing.component';
import { MissionControl } from 'mission-control/mission-control.component';

import { userKeySelector, userSelector } from './accounts/accounts.selectors';
import { fetchCurrentUser } from './accounts/accounts.slice';
import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
  backgroundLocationSelector,
} from './app.slice';
import PrivateRoute from './utils/private-route.component';

const MapLayout = React.lazy(() =>
  import(/* webpackChunkName: "MapLayout" */ 'map'),
);

// const MissionControl = React.lazy(() =>
//   import(
//     /* webpackChunkName: "MissionControl" */ 'mission-control/mission-control.component'
//   ),
// );

const App = () => {
  /** @type {import('history').Location<{backgroundLocation?: import('history').Location}>} */
  const location = useLocation();
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

  console.log(location);

  return (
    <Box width="100vw" height="100vh">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ReactTooltip />
        <React.Suspense fallback={<LoadMaskFallback />}>
          <Switch location={backgroundLocation || location}>
            <PrivateRoute exact path="/" user={user} component={LandingView} />
            <Route path="/accounts" component={Accounts} />
            <PrivateRoute path="/map" user={user} component={MapLayout} />
          </Switch>
          {backgroundLocation && (
            <Switch>
              <Route path="/mission-control" component={MissionControl} />
            </Switch>
          )}
        </React.Suspense>
      </ErrorBoundary>
    </Box>
  );
};

/* 
<React.Suspense fallback={<LoadMaskFallback zIndex={4} />}>
  {location.pathname.includes('/mission-control') && <MissionControl />}
</React.Suspense>
*/

export default App;
