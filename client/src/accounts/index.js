import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { passwordConfigSelector } from 'app.slice';
import PrivateRoute from 'utils/private-route.component';
import { ReactComponent as OrbisLogo } from '../orbis-dark.svg';
import {
  errorSelector,
  isLoadingSelector,
  passwordChangeStatusSelector,
  passwordResetStatusSelector,
  userKeySelector,
  userSelector,
} from './accounts.selectors';
import {
  activateAccount,
  changePassword,
  confirmResetPassword,
  login,
  register,
  resendVerificationEmail,
  resetPassword,
} from './accounts.slice';
import LoginForm from './login/login-form.component';
import PasswordChangeForm from './password/change/password-change-form.component';
import PasswordResetForm from './password/reset/password-reset-form.component';
import PasswordResetRequestForm from './password/reset/password-reset-request-form.component';
import RegisterForm from './register/individual/register-form.component';
import ResendVerificationEmail from './resend-verification-email/resend-verification-email.component';
import * as routes from './routes';

import styles from './index.module.css';

export default () => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const error = useSelector(errorSelector);
  const isLoading = useSelector(isLoadingSelector);
  const resetStatus = useSelector(passwordResetStatusSelector);
  const changeStatus = useSelector(passwordChangeStatusSelector);
  const user = useSelector(userSelector);
  const userKey = useSelector(userKeySelector);
  const passwordConfig = useSelector(passwordConfigSelector);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <OrbisLogo className={styles.logo} />
        <Switch>
          <Route
            exact
            path={`${match.path}${routes.REGISTER}`}
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
            path={[
              match.path,
              `${match.path}${routes.LOGIN}`,
              `${match.path}${routes.CONFIRM_EMAIL}`,
            ]}
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
            path={`${match.path}${routes.PASSWORD_CHANGE}`}
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
            path={`${match.path}${routes.PASSWORD_RESET_REQUEST}`}
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
            path={`${match.path}${routes.PASSWORD_RESET}`}
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
            path={`${match.path}${routes.RESEND_VERIFICATION_EMAIL}`}
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
