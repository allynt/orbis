import React, { useEffect, useRef, lazy, Suspense } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { Dialog /*useModal*/ } from '@astrosat/astrosat-ui';

import PrivateRoute from './utils/private-route.component';

import {
  fetchAppConfig,
  logUserTracking,
  userTrackingIntervalSelector,
} from './app.slice';
import { fetchUser } from './accounts/accounts.slice';
import { userSelector } from './accounts/accounts.selectors';

import Accounts from './accounts';

import LandingView from './landing/landing.component';

import MapLayout from './map';

import styles from './app.module.css';
import LegalDocuments from 'legal-documents/legal-documents.component';

const Admin = lazy(() => import('./admin/admin.component'));

const App = () => {
  const dispatch = useDispatch();
  const trackingId = useSelector(state =>
    state && state.app && state.app.config ? state.app.config.trackingId : null,
  );
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
      dispatch(fetchUser());
    }
  }, [dispatch, user, userKey]);

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
    if (userTrackingInterval) {
      const userTracking = setInterval(() => {
        dispatch(logUserTracking());
      }, userTrackingInterval);

      return () => clearInterval(userTracking);
    }
  }, [dispatch, userTrackingInterval]);

  return (
    <div className={styles.app} ref={ref}>
      <ReactTooltip />

      <main>
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
          <Route exact path={['/terms', '/eula']} component={LegalDocuments} />
          <Suspense fallback={<h3>Loading...</h3>}>
            <PrivateRoute
              exact
              path="/admin-console"
              user={user}
              component={Admin}
            />
          </Suspense>
        </Switch>
      </main>
    </div>
  );
};

export default App;
