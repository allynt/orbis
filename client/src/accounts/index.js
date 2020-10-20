import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

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

import styles from './index.module.css';
import {
  CONFIRM_EMAIL,
  LOGIN,
  PASSWORD_CHANGE,
  PASSWORD_RESET,
  PASSWORD_RESET_REQUEST,
  REGISTER,
  REGISTER_CUSTOMER_USER,
  RESEND,
} from './accounts.constants';
import JourneySelection from './register/journey-selection/journey-selection.component';
import UserRegistration from './register/customer/user-registration/user-registration.component';

export default () => {
  const dispatch = useDispatch();
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
            path={REGISTER}
            render={() => (
              <JourneySelection
                customerRegistrationIsOpen
                individualRegistrationIsOpen={false}
              />
            )}
          />
          <Route
            exact
            path={REGISTER_CUSTOMER_USER}
            render={() => (
              <UserRegistration
                serverErrors={error}
                isLoading={isLoading}
                onSubmit={values => dispatch(register(values))}
                {...passwordConfig}
              />
            )}
          />
          <Route
            exact
            path={[LOGIN, CONFIRM_EMAIL]}
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
            path={PASSWORD_CHANGE}
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
            path={PASSWORD_RESET_REQUEST}
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
            path={PASSWORD_RESET}
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
            path={RESEND}
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
