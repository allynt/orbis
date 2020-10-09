import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PrivateRoute from '../utils/private-route.component';
import AccountActivation from './account-activation.component';
import {
  activateAccount,
  changePassword,
  confirmResetPassword,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
  userSelector,
} from './accounts.slice';
import LoginForm from './login/login-form.component';
import PasswordChangeForm from './password/change/password-change-form.component';
import PasswordResetConfirmForm from './password-reset-confirm-form.component';
import PasswordResetForm from './password/reset/password-reset-request-form.component';
import RegisterForm from './register-form.component';
import styles from './index.module.css';
import { ReactComponent as OrbisLogo } from '../orbis-dark.svg';
import { configSelector } from 'app.slice';

export default () => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const error = useSelector(state => state.accounts.error);
  const registerUserStatus = useSelector(
    state => state.accounts.registerUserStatus,
  );
  const accountActivationStatus = useSelector(
    state => state.accounts.accountActivationStatus,
  );
  const verificationEmailStatus = useSelector(
    state => state.accounts.verificationEmailStatus,
  );
  const resetStatus = useSelector(state => state.accounts.resetStatus);
  const changeStatus = useSelector(state => state.accounts.changeStatus);
  const user = useSelector(userSelector);
  const {
    passwordMinLength,
    passwordMaxLength,
    passwordStrength,
  } = useSelector(configSelector);

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
                register={form => dispatch(register(form))}
                registerUserStatus={registerUserStatus}
                resendVerificationEmail={email =>
                  dispatch(resendVerificationEmail(email))
                }
                error={error}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/login`}
            render={() => (
              <LoginForm
                login={values => dispatch(login(values))}
                user={user}
                error={error}
                resendVerificationEmail={email =>
                  dispatch(resendVerificationEmail(email))
                }
                verificationEmailStatus={verificationEmailStatus}
                passwordMinLength={passwordMinLength}
                passwordMaxLength={passwordMaxLength}
              />
            )}
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
                passwordMinLength={passwordMinLength}
                passwordMaxLength={passwordMaxLength}
                passwordStrength={passwordStrength}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/confirm-email/:key`}
            user={user}
            render={props => (
              <AccountActivation
                match={props.match}
                error={error}
                activateAccount={form => dispatch(activateAccount(form))}
                accountActivationStatus={accountActivationStatus}
              />
            )}
          />
          <Route
            exact
            path={`${match.path}/password/reset`}
            user={user}
            render={() => (
              <PasswordResetForm
                resetPassword={values => dispatch(resetPassword(values))}
                resetStatus={resetStatus}
                error={error}
              />
            )}
          />
          <Route
            path={`${match.path}/password/reset/:token/:uid/`}
            render={props => (
              <PasswordResetConfirmForm
                confirmResetPassword={(form, params) =>
                  dispatch(confirmResetPassword(form, params))
                }
                resetStatus={resetStatus}
                match={props.match}
                error={error}
              />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};
