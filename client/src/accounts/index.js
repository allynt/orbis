import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { passwordConfigSelector } from 'app.slice';
import PrivateRoute from 'utils/private-route.component';

import {
  errorSelector,
  isLoadingSelector,
  isLoggedInSelector,
  passwordChangeStatusSelector,
  passwordResetStatusSelector,
  userSelector,
  minimalUserSelector,
} from './accounts.selectors';
import {
  activateAccount,
  changePassword,
  confirmResetPassword,
  login,
  placeOrder,
  registerCustomer,
  registerUser,
  resendVerificationEmail,
  resetPassword,
} from './accounts.slice';
import LoginForm from './login/login-form.component';
import PasswordChangeForm from './password/change/password-change-form.component';
import PasswordResetForm from './password/reset/password-reset-form.component';
import PasswordResetRequestForm from './password/reset/password-reset-request-form.component';
import ResendVerificationEmail from './resend-verification-email/resend-verification-email.component';
import {
  CONFIRM_EMAIL,
  LOGIN,
  PASSWORD_CHANGE,
  PASSWORD_RESET,
  PASSWORD_RESET_REQUEST,
  REGISTER,
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  REGISTER_CUSTOMER_USER,
  RESEND,
} from './accounts.constants';
import JourneySelection from './register/journey-selection/journey-selection.component';
import UserRegistration from './register/customer/user-registration/user-registration.component';
import CustomerRegistration from './register/customer/customer-registration/customer-registration.component';
import OrderForm from './register/customer/order-form/order-form.component';
import Wrapper from './wrapper.component';

export default () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const isLoading = useSelector(isLoadingSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const resetStatus = useSelector(passwordResetStatusSelector);
  const changeStatus = useSelector(passwordChangeStatusSelector);
  /** @type {User} */
  const user = useSelector(userSelector);
  const minimalUser = useSelector(minimalUserSelector);
  const passwordConfig = useSelector(passwordConfigSelector);

  return (
    <Wrapper>
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
          path={REGISTER_CUSTOMER}
          render={() => (
            <CustomerRegistration
              email={user?.email}
              serverErrors={error}
              isLoading={isLoading}
              onSubmit={values => dispatch(registerCustomer(values))}
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
              onSubmit={values => dispatch(registerUser(values))}
              {...passwordConfig}
            />
          )}
        />
        <Route
          exact
          path={REGISTER_CUSTOMER_ORDER}
          render={() => (
            <OrderForm
              serverErrors={error}
              isLoading={isLoading}
              onSubmit={values => dispatch(placeOrder(values))}
            />
          )}
        />
        <Route
          exact
          path={[LOGIN, CONFIRM_EMAIL]}
          render={props =>
            isLoggedIn &&
            user.is_verified &&
            user.is_verified !== 'False' &&
            !user.registration_stage ? (
              <Redirect to="/" />
            ) : (
              <LoginForm
                user={user}
                minimalUser={minimalUser}
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
    </Wrapper>
  );
};
