import React, { useEffect, useRef, lazy, Suspense } from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Dialog from '@astrosat/astrosat-ui/dist/containers/dialog';
import useModal from '@astrosat/astrosat-ui/dist/containers/use-modal';

import PrivateRoute from './utils/private-route.component';

import { fetchAppConfig } from './app.slice';
import {
  fetchUser,
  login,
  register,
  activateAccount,
  resendVerificationEmail,
  changePassword,
  confirmResetPassword,
  resetPassword,
} from './accounts/accounts.slice';
// import { fetchUsers, createUser, deleteUser, updateUser, copyUser } from './accounts/admin/users.slice';
import { fetchSources, selectPollingPeriod } from './data-layers/data-layers.slice';

import RegisterForm from './accounts/register-form.component';
import TermsAndConditions from './accounts/terms-and-conditions.component';
import AccountActivation from './accounts/account-activation.component';
import LoginForm from './accounts/login-form.component';
import PasswordChangeForm from './accounts/password-change-form.component';
import UpdateUserForm from './accounts/update-user-form.component';
import PasswordResetConfirm from './accounts/password-reset-confirm-form.component';

import LandingView from './landing/landing.component';

import MapLayout from './map';

import styles from './app.module.css';

const PasswordResetForm = lazy(() => import('./accounts/password-reset-form.component'));
// const UserList = lazy(() => import('./accounts/admin/user-list.component'));
// const Admin = lazy(() => import('./accounts/admin/admin.component'));

const App = () => {
  const dispatch = useDispatch();
  const trackingId = useSelector(state =>
    state && state.app && state.app.config ? state.app.config.trackingId : null,
  );

  const user = useSelector(state => state.accounts.user);
  const userKey = useSelector(state => state.accounts.userKey);
  const error = useSelector(state => state.accounts.error);
  const pollingPeriod = useSelector(selectPollingPeriod);

  const registerUserStatus = useSelector(state => state.accounts.registerUserStatus);
  const accountActivationStatus = useSelector(state => state.accounts.accountActivationStatus);
  const verificationEmailStatus = useSelector(state => state.accounts.verificationEmailStatus);
  const resetStatus = useSelector(state => state.accounts.resetStatus);
  const changeStatus = useSelector(state => state.accounts.changeStatus);

  const notYetImplementedDescription = useSelector(state => state.app.notYetImplementedDescription);
  const ref = useRef(null);
  const [isVisible, toggle] = useModal(notYetImplementedDescription !== null ? true : false);
  const activateAccountFn = form => dispatch(activateAccount(form));
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
          <PrivateRoute path="/map" user={user} component={MapLayout} />
          <PrivateRoute
            exact
            path="/password/change"
            user={user}
            render={() => (
              <PasswordChangeForm
                changePassword={form => dispatch(changePassword(form))}
                changeStatus={changeStatus}
                error={error}
              />
            )}
          />
          <PrivateRoute exact path="/user/update" user={user} component={UpdateUserForm} />

          <PrivateRoute exact path="/" user={user} component={LandingView} />

          <Route
            exact
            path="/register"
            render={() => (
              <RegisterForm
                register={form => dispatch(register(form))}
                registerUserStatus={registerUserStatus}
                resendVerificationEmail={email => dispatch(resendVerificationEmail(email))}
                error={error}
              />
            )}
          />
          <Route exact path="/terms" component={TermsAndConditions} />
          <Route
            exact
            path="/login"
            render={() => (
              <LoginForm
                login={values => dispatch(login(values))}
                user={user}
                error={error}
                resendVerificationEmail={email => dispatch(resendVerificationEmail(email))}
                verificationEmailStatus={verificationEmailStatus}
              />
            )}
          />
          <Route
            exact
            path="/account/confirm-email/:key"
            user={user}
            render={props => (
              <AccountActivation
                match={props.match}
                error={error}
                activateAccount={activateAccountFn}
                accountActivationStatus={accountActivationStatus}
              />
            )}
          />
          <Route
            path="/password/reset/:token/:uid/"
            render={props => (
              <PasswordResetConfirm
                confirmResetPassword={(form, params) => dispatch(confirmResetPassword(form, params))}
                resetStatus={resetStatus}
                match={props.match}
                error={error}
              />
            )}
          />
          <Suspense fallback={<h3>Password Rest Loading...</h3>}>
            <Route
              exact
              path="/password/reset"
              user={user}
              render={() => (
                <PasswordResetForm
                  resetPassword={values => dispatch(resetPassword(values))}
                  resetStatus={resetStatus}
                  error={error}
                />
              )}
            />
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
