import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { configSelector, passwordConfigSelector } from 'app.slice';

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
import {
  errorSelector,
  isLoggedInSelector,
  passwordChangeStatusSelector,
  passwordResetStatusSelector,
  requestsSelector,
  userSelector,
} from './accounts.selectors';
import {
  activateAccount,
  changePassword,
  resetPasswordConfirm,
  login,
  placeOrder,
  registerCustomer,
  registerUser,
  resendVerificationEmail,
  resetPasswordRequest,
} from './accounts.slice';
import LoginForm from './login/login-form.component';
import PasswordChangeForm from './password/change/password-change-form.component';
import PasswordResetForm from './password/reset/password-reset-form.component';
import PasswordResetRequestForm from './password/reset/password-reset-request-form.component';
import CustomerRegistration from './register/customer/customer-registration/customer-registration.component';
import OrderForm from './register/customer/order-form/order-form.component';
import UserRegistration from './register/customer/user-registration/user-registration.component';
import JourneySelection from './register/journey-selection/journey-selection.component';
import ResendVerificationEmail from './resend-verification-email/resend-verification-email.component';
import Wrapper from './wrapper.component';

const Index = () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const accountsRequests = useSelector(requestsSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const resetStatus = useSelector(passwordResetStatusSelector);
  const changeStatus = useSelector(passwordChangeStatusSelector);
  const user = useSelector(userSelector);
  const passwordConfig = useSelector(passwordConfigSelector);
  const appConfig = useSelector(configSelector);

  return (
    <Wrapper>
      <Routes>
        <Route
          path={REGISTER}
          element={
            <JourneySelection
              customerRegistrationIsOpen={appConfig.isRegistrationOpen}
              individualRegistrationIsOpen={false}
            />
          }
        />
        <Route
          path={REGISTER_CUSTOMER}
          element={
            <CustomerRegistration
              email={user?.email}
              serverErrors={error}
              isLoading={accountsRequests.registerCustomer === 'pending'}
              onSubmit={values => dispatch(registerCustomer(values))}
            />
          }
        />
        <Route
          path={REGISTER_CUSTOMER_USER}
          element={
            <UserRegistration
              serverErrors={error}
              isLoading={accountsRequests.registerUser === 'pending'}
              onSubmit={values => dispatch(registerUser(values))}
              {...passwordConfig}
            />
          }
        />
        <Route
          path={REGISTER_CUSTOMER_ORDER}
          element={
            <OrderForm
              serverErrors={error}
              isLoading={accountsRequests.placeOrder === 'pending'}
              onSubmit={values => dispatch(placeOrder(values))}
            />
          }
        />
        <Route
          path={LOGIN}
          element={
            isLoggedIn &&
            user.is_verified &&
            user.is_verified !== 'False' &&
            !user.registration_stage ? (
              <Navigate to="/" />
            ) : (
              <LoginForm
                user={user}
                login={values => dispatch(login(values))}
                serverErrors={error}
                activateAccount={form => dispatch(activateAccount(form))}
                isLoading={
                  accountsRequests.login === 'pending' ||
                  accountsRequests.activateAccount === 'pending'
                }
                {...passwordConfig}
              />
            )
          }
        />
        <Route
          path={CONFIRM_EMAIL}
          element={
            isLoggedIn &&
            user.is_verified &&
            user.is_verified !== 'False' &&
            !user.registration_stage ? (
              <Navigate to="/" />
            ) : (
              <LoginForm
                user={user}
                login={values => dispatch(login(values))}
                serverErrors={error}
                activateAccount={form => dispatch(activateAccount(form))}
                isLoading={
                  accountsRequests.login === 'pending' ||
                  accountsRequests.activateAccount === 'pending'
                }
                {...passwordConfig}
              />
            )
          }
        />
        <Route
          path={PASSWORD_CHANGE}
          element={
            <PasswordChangeForm
              changePassword={form => dispatch(changePassword(form))}
              changeStatus={changeStatus}
              error={error}
              {...passwordConfig}
            />
          }
        />
        <Route
          path={PASSWORD_RESET_REQUEST}
          element={
            <PasswordResetRequestForm
              resetPassword={values => dispatch(resetPasswordRequest(values))}
              resetStatus={resetStatus}
              error={error}
            />
          }
        />
        <Route
          path={PASSWORD_RESET}
          element={
            <PasswordResetForm
              confirmResetPassword={(form, params) =>
                dispatch(resetPasswordConfirm({ ...form, ...params }))
              }
              resetStatus={resetStatus}
              error={error}
              {...passwordConfig}
            />
          }
        />
        <Route
          path={RESEND}
          element={
            <ResendVerificationEmail
              email={user?.email}
              onResend={() => dispatch(resendVerificationEmail(user?.email))}
              isLoading={accountsRequests.resendVerificationEmail === 'pending'}
            />
          }
        />
      </Routes>
    </Wrapper>
  );
};

export default Index;
