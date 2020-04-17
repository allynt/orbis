import React, { useEffect, useRef, lazy, Suspense } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import PrivateRoute from './utils/private-route.component';

import { fetchAppConfig } from './app.slice';
import { fetchUser, login, changePassword } from './accounts/accounts.slice';
// import { fetchUsers, createUser, deleteUser, updateUser, copyUser } from './accounts/admin/users.slice';
import { fetchSources } from './map/map.slice';

import RegisterForm from './accounts/register-form.component';
import TermsAndConditions from './accounts/terms-and-conditions.component';
import AccountActivation from './accounts/account-activation.component';
import LoginForm from './accounts/login-form.component';
import PasswordChangeForm from './accounts/password-change-form.component';
import UpdateUserForm from './accounts/update-user-form.component';
import PasswordResetDone from './accounts/password-reset-done.component';
import PasswordResetConfirm from './accounts/password-reset-confirm-form.component';

import LandingView from './landing/landing.component';

import MapLayout from './map';

import styles from './app.module.css';

const PasswordResetForm = lazy(() => import('./accounts/password-reset-form.component'));
const UserList = lazy(() => import('./accounts/admin/user-list.component'));
const Admin = lazy(() => import('./accounts/admin/admin.component'));

const App = () => {
  const dispatch = useDispatch();
  const trackingId = useSelector(state =>
    state && state.app && state.app.config ? state.app.config.trackingId : null
  );
  const selectedTheme = useSelector(state => state.theming.selectedTheme);

  const users = useSelector(state => state.accounts.users);
  const user = useSelector(state => state.accounts.user);
  const error = useSelector(state => state.accounts.error);
  const pollingPeriod = useSelector(state => state.map.pollingPeriod);

  const notYetImplementedDescription = useSelector(state => state.app.notYetImplementedDescription);
  const ref = useRef(null);
  const [isVisible, toggle] = useModal(notYetImplementedDescription !== null ? true : false);
  useEffect(() => {
    if (notYetImplementedDescription !== null) {
      toggle();
    }
  }, [notYetImplementedDescription]);

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

  useEffect(() => {
    // Poll API to get new Data token (expires every X seconds/mins etc)
    // this also fetches the list of data sources the user has access to.
    // console.log('Initial Request for sources');
    if (user) {
      dispatch(fetchSources());

      const interval = setInterval(() => {
        dispatch(fetchSources());
      }, pollingPeriod);
      return () => {
        clearInterval(interval);
      };
    }
  }, [user, pollingPeriod]);

  return (
    <div className={`${styles.app}`} ref={ref}>
      <ReactTooltip />

      <main>
        <Dialog isVisible={isVisible} title="Sorry, Not Ready Yet!" close={toggle} ref={ref}>
          <p className={styles.paragraph}>
            Sorry for the inconvenience, but this feature is not available yet! Do not worry, we will let you know when
            it will be ready.
          </p>
        </Dialog>

        <Switch>
          <PrivateRoute path="/map" user={user} component={MapLayout} />
          <PrivateRoute
            exact
            path="/password/change"
            user={user}
            render={() => <PasswordChangeForm changePassword={form => dispatch(changePassword(form))} />}
          />
          <PrivateRoute exact path="/user/update" user={user} component={UpdateUserForm} />

          <PrivateRoute exact path="/" user={user} component={LandingView} />

          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/terms" component={TermsAndConditions} />
          <Route
            exact
            path="/login"
            render={() => <LoginForm login={values => dispatch(login(values))} user={user} error={error} />}
          />
          <Route exact path="/account/confirm-email/:key" user={user} component={AccountActivation} />
          <Route path="/reset_password_done" component={PasswordResetDone} />
          <Route path="/password/reset/:token/:uid/" component={PasswordResetConfirm} />
          <Suspense fallback={<h3>Password Rest Loading...</h3>}>
            <Route exact path="/password/reset" user={user} component={PasswordResetForm} />
          </Suspense>
          {/* <Suspense fallback={<h3>Admin Loading...</h3>}>
            <PrivateRoute path="/admin" user={user} component={Admin} />
            <PrivateRoute
              exact
              path="/users"
              user={user}
              render={() => (
                <UserList
                  users={users}
                  fetchUsers={fetchUsers}
                  createUser={createUser}
                  deleteUser={deleteUser}
                  updateUser={updateUser}
                  copyUser={copyUser}
                />
              )}
            />
            <PrivateRoute exact path="/others" user={user} component={UserList} />
          </Suspense> */}
        </Switch>
      </main>
    </div>
  );
};

export default App;
