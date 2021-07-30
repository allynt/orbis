import { push } from 'connected-react-router';
import fetch from 'jest-fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  createCustomerUserSuccess,
  setCurrentCustomer,
} from 'admin/admin.slice';

import {
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  RESEND,
} from './accounts.constants';
import reducer, {
  activateAccount,
  changePassword,
  confirmResetPassword,
  fetchRequested,
  fetchCurrentUser,
  login,
  logout,
  passwordResetRequestedFailure,
  passwordResetRequestedSuccess,
  placeOrder,
  registerCustomer,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
  status,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './accounts.slice';

const mockStore = configureMockStore([thunk]);

describe('Accounts Slice', () => {
  describe('Accounts Actions', () => {
    let store = null;
    const errorMessages = {
      error_1: ['First error relating to failed request.'],
      error_2: ['Second error relating to failed request.'],
      error_3: ['Third error relating to failed request.'],
    };

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: {
          userKey: 'testkey',
          user: { username: 'testusername', email: 'testusername@test.com' },
        },
      });
    });

    it('should dispatch register failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          errors: errorMessages,
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2',
      };
      await store.dispatch(registerUser(form));

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: registerUser.rejected.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        }),
      );
    });

    it('should dispatch register success action.', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          payload: {},
          type: registerUser.fulfilled.type,
        }),
        {
          payload: { args: ['/accounts/resend'], method: 'push' },
          type: '@@router/CALL_HISTORY_METHOD',
        },
      ]);

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2',
      };

      await store.dispatch(registerUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch user failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          errors: errorMessages,
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      await store.dispatch(fetchCurrentUser());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: fetchCurrentUser.rejected.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        }),
      );
    });

    it('should dispatch fetch user success action.', async () => {
      const user = { username: 'testusername', email: 'testusername@test.com' };
      fetch.mockResponse(JSON.stringify(user));

      await store.dispatch(fetchCurrentUser());
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: fetchCurrentUser.fulfilled.type,
          payload: user,
        }),
      );
    });

    it('should dispatch logout failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          errors: errorMessages,
        }),
        {
          status: 401,
          statusText: 'Test Error',
        },
      );

      await store.dispatch(logout());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: logout.rejected.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        }),
      );
    });

    it('should dispatch logout success action.', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      await store.dispatch(logout());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: logout.fulfilled.type }),
      );
    });

    it('should dispatch update user failure action.', async () => {
      fetch.once(
        JSON.stringify({
          errors: errorMessages,
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: updateUserFailure.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        },
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };

      await store.dispatch(updateUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user success action.', async () => {
      const userKey = { token: 'testkey' };

      fetch.mockResponse(JSON.stringify(userKey));

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        { type: updateUserSuccess.type, payload: userKey },
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };

      await store.dispatch(updateUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Accounts Reducer', () => {
    describe(`${fetchRequested}`, () => {
      it('sets isLoading to true', () => {
        const result = reducer({}, fetchRequested());
        expect(result.isLoading).toBe(true);
      });
    });

    describe('pending actions', () => {
      it('sets isLoading to true', () => {
        const result = reducer({}, { type: 'someAction/pending' });
        expect(result.isLoading).toBe(true);
      });
    });

    const setsIsLoadingToFalse = true,
      setsErrorToNull = true,
      setsUserToPayload = true,
      setsErrorToPayload = true,
      setsUserToPayloadUser = true,
      setsUserKeyToNull = true;

    describe.each`
      action                               | config
      ${registerUser.fulfilled}            | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserToPayload }}
      ${registerUser.rejected}             | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${registerCustomer.fulfilled}        | ${{ setsIsLoadingToFalse, setsErrorToNull }}
      ${registerCustomer.rejected}         | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${placeOrder.fulfilled}              | ${{ setsIsLoadingToFalse, setsErrorToNull }}
      ${placeOrder.rejected}               | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${login.fulfilled}                   | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserToPayloadUser }}
      ${login.rejected}                    | ${{ setsIsLoadingToFalse, setsUserToPayloadUser, setsUserKeyToNull }}
      ${resendVerificationEmail.fulfilled} | ${{ setsIsLoadingToFalse, setsErrorToNull }}
      ${resendVerificationEmail.rejected}  | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${fetchCurrentUser.fulfilled}        | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserToPayload }}
      ${fetchCurrentUser.rejected}         | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${updateUserSuccess}                 | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserToPayload }}
      ${updateUserFailure}                 | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${logout.fulfilled}                  | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserKeyToNull }}
      ${logout.rejected}                   | ${{ setsIsLoadingToFalse, setsErrorToPayload }}
      ${activateAccount.fulfilled}         | ${{ setsIsLoadingToFalse, setsErrorToNull, setsUserKeyToNull, setsUserToPayloadUser }}
      ${activateAccount.rejected}          | ${{ setsIsLoadingToFalse, setsErrorToPayload, setsUserKeyToNull }}
      ${changePassword.fulfilled}          | ${{ setsErrorToNull }}
      ${changePassword.rejected}           | ${{ setsErrorToPayload }}
      ${resetPasswordSuccess}              | ${{ setsErrorToNull }}
      ${resetPasswordFailure}              | ${{ setsErrorToPayload }}
      ${passwordResetRequestedSuccess}     | ${{ setsErrorToNull, setsUserToPayload }}
      ${passwordResetRequestedFailure}     | ${{ setsErrorToPayload }}
    `(
      '$action.type',
      ({
        action,
        config: {
          setsIsLoadingToFalse,
          setsErrorToNull,
          setsUserToPayload,
          setsUserToPayloadUser,
          setsErrorToPayload,
          setsUserKeyToNull,
        },
      }) => {
        if (setsIsLoadingToFalse) {
          it('sets isLoading to false', () => {
            expect(
              reducer({ isLoading: true }, { type: action.type, payload: {} }),
            ).toEqual(expect.objectContaining({ isLoading: false }));
          });
        }

        if (setsErrorToNull) {
          it('sets error to null', () => {
            expect(reducer({ error: '123' }, action({})).error).toBeNull();
          });
        }

        if (setsUserToPayload) {
          it('sets user to payload', () => {
            const user = { name: 'Test User' };
            expect(reducer({}, action(user)).user).toEqual(user);
          });
        }

        if (setsUserToPayloadUser) {
          it('sets user to payload.user', () => {
            const user = { name: 'Test User' };
            expect(
              reducer({}, { type: action.type, payload: { user } }).user,
            ).toEqual(user);
          });
        }

        if (setsErrorToPayload) {
          it('sets error to payload', () => {
            expect(
              reducer({}, { type: action.type, payload: '123' }).error,
            ).toBe('123');
          });
        }

        if (setsUserKeyToNull) {
          it('sets userKey to null', () => {
            expect(
              reducer({ userKey: '123' }, { type: action.type, payload: {} })
                .userKey,
            ).toBeNull();
          });
        }
      },
    );

    describe(`${login.fulfilled.type}`, () => {
      it('sets userKey to payload.userKey', () => {
        expect(
          reducer(
            {},
            { type: login.fulfilled.type, payload: { userKey: '123' } },
          ).userKey,
        ).toEqual('123');
      });
    });

    describe(`${login.rejected.type}`, () => {
      it('sets error to payload.errors', () => {
        const error = 'This is an error';
        expect(
          reducer({}, { type: login.rejected.type, payload: { errors: error } })
            .error,
        ).toEqual(error);
      });
    });

    describe(`${logout.fulfilled.type}`, () => {
      it('sets user to null', () => {
        expect(
          reducer(
            { user: { name: 'Test User' } },
            { type: logout.fulfilled.type },
          ).user,
        ).toBeNull();
      });
    });

    describe(`${changePassword.fulfilled.type}`, () => {
      it(`sets changeStatus to ${status.PENDING}`, () => {
        expect(
          reducer({}, { type: changePassword.fulfilled.type }).changeStatus,
        ).toBe(status.PENDING);
      });
    });

    describe(`${resetPasswordSuccess}`, () => {
      it(`sets resetStatus to ${status.PENDING}`, () => {
        expect(reducer({}, resetPasswordSuccess()).resetStatus).toBe(
          status.PENDING,
        );
      });
    });

    describe(`${passwordResetRequestedSuccess}`, () => {
      it(`sets resetStatus to ${status.COMPLETE}`, () => {
        expect(reducer({}, passwordResetRequestedSuccess()).resetStatus).toBe(
          status.COMPLETE,
        );
      });
    });
  });

  describe('Thunks', () => {
    let dispatch;
    let getState;
    const errorResponse = {
      errors: {
        test: ['¿problema?'],
      },
    };

    beforeEach(() => {
      fetch.resetMocks();
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        accounts: { userKey: '123' },
        admin: { currentCustomer: { id: '123' } },
      }));
    });

    describe('registerCustomer', () => {
      /**@type {import('./register/customer/customer-registration/customer-registration.component').FormValues} */
      const formValues = {
        customerName: 'Test Customer',
        customerNameOfficial: 'Test Customer Ltd.',
        customerType: 'GOVERNMENT',
        email: 'test@test.com',
        licence: 'ORBIS Core',
        numberOfLicences: 10,
        registeredNumber: '1234',
        subscriptionPeriod: '2021-04-01T00:00:00+0000',
      };
      const createCustomerResponse = {
        id: 'fake-customer-id-123',
        type: 'MULTIPLE',
        name: formValues.customerName,
        official_name: formValues.customerNameOfficial,
        company_type: formValues.customerType,
        registered_id: formValues.registeredNumber,
      };
      const createCustomerUserResponse = {
        id: 'fake-customer-user-id-123',
        type: 'MANAGER',
        status: 'ACTIVE',
        invitation_date: new Date().toISOString(),
        user: {
          id: 'fake-user-id-123',
        },
        customer: 'fake-customer-id-123',
      };
      const fetchUserResponse = {
        id: 'fake-user-id-123',
      };
      const errorResponse = { errors: { test: ['problem'] } };

      it('creates new customer and sets in state', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(fetchUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(createCustomerResponse),
        );
      });

      it('dispatches failure on create customer error', async () => {
        fetch.once(JSON.stringify(errorResponse), {
          status: 401,
          statusText: 'Test Error',
        });
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: registerCustomer.rejected.type }),
        );
      });

      it('creates a customer user and sets in state', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(fetchUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          createCustomerUserSuccess({ user: createCustomerUserResponse }),
        );
      });

      it('dispatches failure on customer user creation error', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(errorResponse), {
            status: 401,
            statusText: 'Test Error',
          });
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it('fetches the user after customer and customer user creation', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(fetchUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.fulfilled.type,
            payload: fetchUserResponse,
          }),
        );
      });

      it('dispatches the success action', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(fetchUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.fulfilled.type,
          }),
        );
      });

      it('navigates to order view', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(fetchUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER_ORDER));
      });

      it('dispatches failure on fetch user failure', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse))
          .once(JSON.stringify(errorResponse), {
            status: 401,
            statusText: 'Test Error',
          });
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });
    });

    describe('placeOrder', () => {
      /** @type {import('./register/customer/order-form/order-form.component').FormValues} */
      const formValues = {
        amount: 0,
        confirm: true,
        licences: 10,
        paymentType: 'Free Trial',
        period: '2021-04-01T00:00:00+0000',
        subscription: 'core',
      };

      const placeOrderResponseBody = {
        id: 'fb0e3db8-0302-41b5-9ca5-cfe763393674',
        user: 'test@test.com',
        created: new Date().toISOString(),
        order_type: 'Free Trial',
        cost: 0,
        items: [
          {
            id: 3,
            orb: 'core',
            n_licences: 10,
            cost: 0,
            subscription_period: '2021-04-01T00:00:00+0000',
          },
        ],
      };

      const fetchCustomerResponseBody = {
        id: 'fake-customer-id-123',
      };

      const failureResponseBody = {
        errors: {
          test: ['¿problema?'],
        },
      };

      it('calls the success action on successful request', async () => {
        fetch.once(JSON.stringify(placeOrderResponseBody));
        fetch.once(JSON.stringify(fetchCustomerResponseBody));
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: placeOrder.fulfilled.type }),
        );
      });

      it('navigates to landing on success', async () => {
        fetch.once(JSON.stringify(placeOrderResponseBody));
        fetch.once(JSON.stringify(fetchCustomerResponseBody));
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(push('/'));
      });

      it('calls the failure action on failed request', async () => {
        fetch.once(JSON.stringify(failureResponseBody), {
          status: 401,
          statusText: 'Test Error',
        });
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: placeOrder.rejected.type,
            payload: failureResponseBody.errors.test,
          }),
        );
      });

      it('fetches the updated customer and sets', async () => {
        fetch
          .once(JSON.stringify(placeOrderResponseBody))
          .once(JSON.stringify(fetchCustomerResponseBody));
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(fetchCustomerResponseBody),
        );
      });

      it('calls the failure action on fetch customer failure', async () => {
        fetch
          .once(JSON.stringify(placeOrderResponseBody))
          .once(JSON.stringify(failureResponseBody), {
            status: 418,
            statusText: 'ERROR',
          });
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: placeOrder.rejected.type,
            payload: failureResponseBody.errors.test,
          }),
        );
      });

      it('Uses the customer id from the user if current customer is undefined', async () => {
        fetch.once(JSON.stringify(placeOrderResponseBody));
        fetch.once(JSON.stringify(fetchCustomerResponseBody));
        jest.spyOn(window, 'fetch');
        await placeOrder(formValues)(dispatch, () => ({
          admin: {},
          accounts: { user: { customers: [{ id: 'testcustomerId' }] } },
        }));
        expect(fetch).toHaveBeenNthCalledWith(
          1,
          expect.stringContaining('/api/customers/testcustomerId/orders/'),
          expect.anything(),
        );
      });
    });

    describe('login', () => {
      const formValues = {
        email: 'test@test.com',
        password: 'reallystongpasswordthis',
      };

      const loginResponse = {
        token: '123',
        user: {
          id: '123',
        },
      };

      const loginReponseUserNotVerified = {
        ...loginResponse,
        user: {
          ...loginResponse.user,
          is_verified: false,
        },
      };

      const getUserResponse = { id: 'fake-user-id-123' };

      const getUserCustomerResponse = {
        ...getUserResponse,
        registration_stage: 'CUSTOMER',
      };

      const getUserOrderResponse = {
        ...getUserResponse,
        registration_stage: 'ORDER',
      };

      const errorResponse = {
        user: getUserResponse,
        errors: { test: ['Foobar'] },
      };

      it('shows the resend email view if the user is not verified', async () => {
        fetch.once(JSON.stringify(loginReponseUserNotVerified), {
          status: 418,
          statusText: 'Error',
        });
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push(RESEND));
      });

      it('dispatches the failure action if the login request fails', async () => {
        fetch.once(JSON.stringify(errorResponse), {
          status: 418,
          statusText: 'Error',
        });
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: login.rejected.type,
            payload: {
              ...errorResponse,
              errors: errorResponse.errors.test,
            },
          }),
        );
      });

      it('fetches the user and dispatches success action', async () => {
        fetch
          .once(JSON.stringify(loginResponse))
          .once(JSON.stringify(getUserResponse));
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: login.fulfilled.type,
            payload: {
              userKey: loginResponse.token,
              user: getUserResponse,
            },
          }),
        );
      });

      it('dispatches the failure action if the get user request fails', async () => {
        fetch
          .once(JSON.stringify(loginResponse))
          .once(JSON.stringify(errorResponse), { status: 418 });
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: login.rejected.type,
            payload: expect.objectContaining({
              errors: errorResponse.errors.test,
            }),
          }),
        );
      });

      it('navigates to root if the user is not in the process of registering', async () => {
        fetch
          .once(JSON.stringify(loginResponse))
          .once(JSON.stringify(getUserResponse));
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push('/'));
      });

      it('navigates to REGISTER_CUSTOMER if the user needs to create a customer', async () => {
        fetch
          .once(JSON.stringify(loginResponse))
          .once(JSON.stringify(getUserCustomerResponse));
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER));
      });

      it('navigates to REGISTER_CUSTOMER_ORDER if the user needs to place an order', async () => {
        fetch
          .once(JSON.stringify(loginResponse))
          .once(JSON.stringify(getUserOrderResponse));
        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER_ORDER));
      });
    });

    describe('activateAccount', () => {
      it(`dispatches ${activateAccount.rejected.type} if the response is not ok`, async () => {
        fetch.once(
          JSON.stringify({
            errors: {
              test: ['¿problema?'],
            },
          }),
          { status: 401, statusText: 'Test Error' },
        );
        await activateAccount({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: activateAccount.rejected.type,
            payload: ['¿problema?'],
          }),
        );
      });

      it(`dispatches ${activateAccount.fulfilled.type} on successful activation`, async () => {
        const user = { name: 'Test User' };
        fetch.once(JSON.stringify({ user }));
        await activateAccount({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: activateAccount.fulfilled.type,
            payload: { user },
          }),
        );
      });
    });

    describe('resendVerificationEmail', () => {
      it(`dispatches ${resendVerificationEmail.rejected.type} on failed request`, async () => {
        fetch.once(JSON.stringify(errorResponse), {
          status: 401,
          statusText: 'Wrong',
        });
        await resendVerificationEmail('')(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: resendVerificationEmail.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${resendVerificationEmail.fulfilled.type} on success`, async () => {
        fetch.once(JSON.stringify({}));
        await resendVerificationEmail('')(dispatch, getState);
        expect(dispatch).toBeCalledWith(
          expect.objectContaining({
            type: resendVerificationEmail.fulfilled.type,
          }),
        );
      });
    });

    describe('changePassword', () => {
      it(`dispatches ${changePassword.rejected.type} on failed request`, async () => {
        fetch.once(JSON.stringify(errorResponse), {
          status: 401,
          statusText: 'Wrong',
        });
        await changePassword({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: changePassword.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${changePassword.fulfilled.type} on success`, async () => {
        fetch.once(JSON.stringify({}));
        await changePassword({})(dispatch, getState);
        expect(dispatch).toBeCalledWith(
          expect.objectContaining({ type: changePassword.fulfilled.type }),
        );
      });
    });

    describe('confirmResetPassword', () => {
      it(`dispatches ${passwordResetRequestedFailure} on failed request`, async () => {
        fetch.once(JSON.stringify(errorResponse), {
          ok: false,
          status: 401,
          statusText: 'Wrong',
        });
        await confirmResetPassword({}, {})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          passwordResetRequestedFailure(errorResponse.errors.test),
        );
      });

      it(`dispatches ${passwordResetRequestedSuccess} with user on success`, async () => {
        const user = { name: 'Test user' };
        fetch.once(JSON.stringify({ user }));
        await confirmResetPassword({}, {})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          passwordResetRequestedSuccess(user),
        );
      });
    });

    describe('resetPassword', () => {
      it(`dispatches ${resetPasswordFailure} on failed request`, async () => {
        fetch.once(JSON.stringify(errorResponse), {
          ok: false,
          status: 401,
          statusText: 'Wrong',
        });
        await resetPassword({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          resetPasswordFailure(errorResponse.errors.test),
        );
      });

      it(`dispatches ${resetPasswordSuccess} on success`, async () => {
        fetch.once(JSON.stringify({}));
        await resetPassword({})(dispatch, getState);
        expect(dispatch).toBeCalledWith(resetPasswordSuccess());
      });
    });
  });
});
