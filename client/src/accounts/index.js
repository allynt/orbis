import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { configSelector } from 'app.slice';
import PrivateRoute from 'utils/private-route.component';
import { ReactComponent as OrbisLogo } from '../orbis-dark.svg';
import {
  activateAccount,
  changePassword,
  confirmResetPassword,
  isLoadingSelector,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
  userKeySelector,
  userSelector,
} from './accounts.slice';
import styles from './index.module.css';
import LoginForm from './login/login-form.component';
import PasswordChangeForm from './password/change/password-change-form.component';
import PasswordResetForm from './password/reset/password-reset-form.component';
import PasswordResetRequestForm from './password/reset/password-reset-request-form.component';
import RegisterForm from './register/individual/register-form.component';
import ResendVerificationEmail from './resend-verification-email/resend-verification-email.component';

export default () => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const error = useSelector(state => state.accounts.error);
  const isLoading = useSelector(isLoadingSelector);
  const resetStatus = useSelector(state => state.accounts.resetStatus);
  const changeStatus = useSelector(state => state.accounts.changeStatus);
  const user = useSelector(userSelector);
  const userKey = useSelector(userKeySelector);
  const {
    passwordMinLength,
    passwordMaxLength,
    passwordStrength,
  } = useSelector(configSelector);
  const passwordConfig = {
    passwordMinLength,
    passwordMaxLength,
    passwordStrength,
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <OrbisLogo className={styles.logo} />
        <Switch>
          <Route
            exact
            path={`${match.path}/register`}
            render={() => (
              <RegisterForm
                registerUser={form => dispatch(register(form))}
                serverErrors={error}
                isLoading={isLoading}
                {...passwordConfig}
              />
            )}
          />
          <Route
            exact
            path={[`${match.path}/login`, `${match.path}/confirm-email/:key`]}
            render={props =>
              user &&
              user.is_verified &&
              user.is_verified !== 'False' &&
              userKey ? (
                <Redirect to="/" />
              ) : (
                <LoginForm
                  user={user}
                  login={values => dispatch(login(values))}
                  serverErrors={error}
                  activateAccount={form => dispatch(activateAccount(form))}
                  isLoading={isLoading}
                  {...props}
                  {...passwordConfig}
                />
              )
            }
          />
          <PrivateRoute
            exact
            path={`${match.path}/password/change`}
            user={user}
            render={() => (
              <PasswordChangeForm
                changePassword={form => dispatch(changePassword(form))}
                changeStatus={changeStatus}
                error={error}
                {...passwordConfig}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/password/reset`}
            user={user}
            render={() => (
              <PasswordResetRequestForm
                resetPassword={values => dispatch(resetPassword(values))}
                resetStatus={resetStatus}
                error={error}
              />
            )}
          />
          <Route
            path={`${match.path}/password/reset/:token/:uid/`}
            render={props => (
              <PasswordResetForm
                confirmResetPassword={(form, params) =>
                  dispatch(confirmResetPassword(form, params))
                }
                resetStatus={resetStatus}
                match={props.match}
                error={error}
                {...passwordConfig}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/resend`}
            render={() => (
              <ResendVerificationEmail
                email={user?.email}
                onResend={() => dispatch(resendVerificationEmail(user?.email))}
                isLoading={isLoading}
              />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};
