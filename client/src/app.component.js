import React, { useEffect, lazy, Suspense } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import PrivateRoute from './utils/private-route.component';

import { fetchAppConfig } from './app.actions';

import { fetchUser } from './accounts/accounts.actions';

import RegisterFormContainer from './accounts/register-form.container';
import AccountActivationContainer from './accounts/account-activation-form.container';
import LoginFormContainer from './accounts/login-form.container';
// import PasswordResetContainer from './accounts/password-reset-form.container';
import PasswordChangeContainer from './accounts/password-change-form.container';
import UpdateUserContainer from './accounts/update-user-form.container';
import PasswordResetDone from './accounts/password-reset-done.component';
import PasswordResetConfirmContainer from './accounts/password-reset-confirm-form.container';

import LandingView from './landing/landing.component';

import { Button } from '@astrosat/astrosat-ui';

import MapLayout from './map';

import styles from './app.module.css';

const PasswordResetContainer = lazy(() => import('./accounts/password-reset-form.container'));
const UserList = lazy(() => import('./accounts/admin/user-list.container'));
const Admin = lazy(() => import('./accounts/admin/admin.container'));

const App = () => {
  const dispatch = useDispatch();
  const trackingId = useSelector(state =>
    state && state.app && state.app.config ? state.app.config.trackingId : null
  );
  const selectedTheme = useSelector(state => state.theming.selectedTheme);

  const user = useSelector(state => state.accounts.user);

  // If page refreshed, ensure we try to retrieve the logged in user.
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
      dispatch(fetchAppConfig());
    }
  }, [dispatch, user]);

  // If the Google Analytics tracking id doesn't exist, fetch it,
  // then setup analytics. This should only be done once on app
  // startup.
  useEffect(() => {
    if (!trackingId) {
      ReactGA.initialize(trackingId);
      // ReactGA.initialize(trackingId, { debug: true });
      ReactGA.pageview('/', null, 'APPLICATION NAME App');
    }
  }, [dispatch, trackingId]);

  return (
    <div className={`${styles.app} ${styles[selectedTheme.value]}`}>
      <ReactTooltip />

      <main>
        <Switch>
          <PrivateRoute path="/map" user={user} count={1} component={MapLayout} />
          <PrivateRoute exact path="/password/change" user={user} component={PasswordChangeContainer} />
          <PrivateRoute exact path="/user/update" user={user} component={UpdateUserContainer} />

          <PrivateRoute exact path="/" user={user} component={LandingView} />

          <Route exact path="/register" component={RegisterFormContainer} />
          <Route exact path="/login" component={LoginFormContainer} />
          <Suspense fallback={<h3>Password Rest Loading...</h3>}>
            <Route exact path="/password/reset" user={user} component={PasswordResetContainer} />
          </Suspense>
          <Route path="/reset_password_done" component={PasswordResetDone} />
          <Route path="/password/reset/:token/:uid/" component={PasswordResetConfirmContainer} />
          <Route exact path="/account/confirm-email/:key" user={user} component={AccountActivationContainer} />
          <Suspense fallback={<h3>Admin Loading...</h3>}>
            <PrivateRoute exact path="/admin" user={user} component={Admin} />
            <PrivateRoute exact path="/users" user={user} component={UserList} />
            <PrivateRoute exact path="/others" user={user} component={UserList} />
          </Suspense>
        </Switch>
      </main>
    </div>
  );
};

export default App;
