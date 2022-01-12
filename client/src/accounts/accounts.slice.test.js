import { rest } from 'msw';
import { push } from 'redux-first-history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  setCurrentCustomer,
  createCustomerUserSuccess,
} from 'mission-control/mission-control.slice';
import { server } from 'mocks/server';

import {
  REGISTER_CUSTOMER,
  REGISTER_CUSTOMER_ORDER,
  RESEND_URL,
} from './accounts.constants';
import reducer, {
  activateAccount,
  changePassword,
  resetPasswordConfirm,
  fetchCurrentUser,
  login,
  logout,
  placeOrder,
  registerCustomer,
  registerUser,
  resendVerificationEmail,
  resetPasswordRequest,
  status,
  updateUser,
} from './accounts.slice';

const mockStore = configureMockStore([thunk]);

const BASE_STATE = {
  isLoading: false,
  changeStatus: '',
  resetStatus: '',
  _persist: { rehydrated: true, version: 1 },
};

describe('Accounts Slice', () => {
  describe('Accounts Actions', () => {
    let store = null;

    beforeEach(() => {
      store = mockStore({
        accounts: {
          userKey: 'testkey',
          user: { username: 'testusername', email: 'testusername@test.com' },
        },
      });
    });

    it('should dispatch register failure action.', async () => {
      server.use(
        rest.post('*/api/authentication/registration/', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        newPassword: 'password1',
        newPasswordConfirm: 'password2',
        name: 'Test Name',
        organisationName: 'Test Org',
        acceptedTerms: true,
      };
      await store.dispatch(registerUser(form));

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: registerUser.rejected.type,
        }),
      );
    });

    it('should dispatch register success action.', async () => {
      server.use(
        rest.post('*/api/authentication/registration/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );

      const expectedActions = expect.arrayContaining([
        expect.objectContaining({
          payload: {},
          type: registerUser.fulfilled.type,
        }),
        expect.objectContaining({
          payload: { args: ['/accounts/resend'], method: 'push' },
          type: '@@router/CALL_HISTORY_METHOD',
        }),
      ]);

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        newPassword: 'password1',
        newPasswordConfirm: 'password2',
        name: 'Test Name',
        organisationName: 'Test Org',
        acceptedTerms: true,
      };

      await store.dispatch(registerUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch user failure action.', async () => {
      server.use(
        rest.get('*/api/users/:userId', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      await store.dispatch(fetchCurrentUser());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: fetchCurrentUser.rejected.type,
        }),
      );
    });

    it('should dispatch fetch user success action.', async () => {
      const user = { username: 'testusername', email: 'testusername@test.com' };

      server.use(
        rest.get('*/api/users/:userId', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(user));
        }),
      );

      await store.dispatch(fetchCurrentUser());
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: fetchCurrentUser.fulfilled.type,
          payload: user,
        }),
      );
    });

    it('should dispatch logout failure action.', async () => {
      server.use(
        rest.post('*/api/authentication/logout/', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      await store.dispatch(logout());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: logout.rejected.type,
        }),
      );
    });

    it('should dispatch logout success action.', async () => {
      const user = { username: 'testusername', email: 'testusername@test.com' };

      server.use(
        rest.post('*/api/authentication/logout/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(user));
        }),
      );

      await store.dispatch(logout());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: logout.fulfilled.type }),
      );
    });

    it('should dispatch update user failure action.', async () => {
      server.use(
        rest.put('*/api/users/:userId/', (req, res, ctx) => {
          return res(ctx.status(401, 'Test Error'));
        }),
      );

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };

      await store.dispatch(updateUser(form));

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: updateUser.rejected.type,
        }),
      );
    });

    it('should dispatch update user success action.', async () => {
      const userKey = { token: 'testkey' };

      server.use(
        rest.put('*/api/users/:userId/', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(userKey));
        }),
      );

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };

      await store.dispatch(updateUser(form));

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({ type: updateUser.fulfilled.type }),
      );
    });
  });

  describe('Accounts Reducer', () => {
    const setsErrorToNull = true,
      setsUserToPayload = true,
      setsErrorToPayload = true,
      setsUserToPayloadUser = true,
      setsUserKeyToNull = true;

    describe.each`
      action                               | config
      ${registerUser.fulfilled}            | ${{ setsErrorToNull, setsUserToPayload }}
      ${registerUser.rejected}             | ${{ setsErrorToPayload }}
      ${registerCustomer.fulfilled}        | ${{ setsErrorToNull }}
      ${registerCustomer.rejected}         | ${{ setsErrorToPayload }}
      ${placeOrder.fulfilled}              | ${{ setsErrorToNull }}
      ${placeOrder.rejected}               | ${{ setsErrorToPayload }}
      ${login.fulfilled}                   | ${{ setsErrorToNull, setsUserToPayloadUser }}
      ${login.rejected}                    | ${{ setsUserToPayloadUser, setsUserKeyToNull }}
      ${resendVerificationEmail.fulfilled} | ${{ setsErrorToNull }}
      ${resendVerificationEmail.rejected}  | ${{ setsErrorToPayload }}
      ${fetchCurrentUser.fulfilled}        | ${{ setsErrorToNull, setsUserToPayload }}
      ${fetchCurrentUser.rejected}         | ${{ setsErrorToPayload }}
      ${updateUser.fulfilled}              | ${{ setsErrorToNull, setsUserToPayload }}
      ${updateUser.rejected}               | ${{ setsErrorToPayload }}
      ${logout.fulfilled}                  | ${{ setsErrorToNull, setsUserKeyToNull }}
      ${logout.rejected}                   | ${{ setsErrorToPayload }}
      ${activateAccount.fulfilled}         | ${{ setsErrorToNull, setsUserKeyToNull, setsUserToPayloadUser }}
      ${activateAccount.rejected}          | ${{ setsErrorToPayload, setsUserKeyToNull }}
      ${changePassword.fulfilled}          | ${{ setsErrorToNull }}
      ${changePassword.rejected}           | ${{ setsErrorToPayload }}
      ${resetPasswordRequest.fulfilled}    | ${{ setsErrorToNull }}
      ${resetPasswordRequest.rejected}     | ${{ setsErrorToPayload }}
      ${resetPasswordConfirm.fulfilled}    | ${{ setsErrorToNull, setsUserToPayload }}
      ${resetPasswordConfirm.rejected}     | ${{ setsErrorToPayload }}
    `(
      '$action.type',
      ({
        action,
        config: {
          setsErrorToNull,
          setsUserToPayload,
          setsUserToPayloadUser,
          setsErrorToPayload,
          setsUserKeyToNull,
        },
      }) => {
        if (setsErrorToNull) {
          it('sets error to null', () => {
            expect(
              reducer({ ...BASE_STATE, error: '123' }, action({})).error,
            ).toBeNull();
          });
        }

        if (setsUserToPayload) {
          it('sets user to payload', () => {
            const user = { name: 'Test User' };
            expect(reducer(BASE_STATE, action(user)).user).toEqual(user);
          });
        }

        if (setsUserToPayloadUser) {
          it('sets user to payload.user', () => {
            const user = { name: 'Test User' };
            expect(
              reducer(BASE_STATE, { type: action.type, payload: { user } })
                .user,
            ).toEqual(user);
          });
        }

        if (setsErrorToPayload) {
          it('sets error to payload', () => {
            expect(
              reducer(BASE_STATE, { type: action.type, payload: '123' }).error,
            ).toBe('123');
          });
        }

        if (setsUserKeyToNull) {
          it('sets userKey to null', () => {
            expect(
              reducer(
                { ...BASE_STATE, userKey: '123' },
                { type: action.type, payload: {} },
              ).userKey,
            ).toBeNull();
          });
        }
      },
    );

    describe(`${login.fulfilled.type}`, () => {
      it('sets userKey to payload.userKey', () => {
        expect(
          reducer(BASE_STATE, {
            type: login.fulfilled.type,
            payload: { userKey: '123' },
          }).userKey,
        ).toEqual('123');
      });
    });

    describe(`${login.rejected.type}`, () => {
      it('sets error to payload.errors', () => {
        const error = 'This is an error';
        expect(
          reducer(BASE_STATE, {
            type: login.rejected.type,
            payload: { errors: error },
          }).error,
        ).toEqual(error);
      });
    });

    describe(`${logout.fulfilled.type}`, () => {
      it('sets user to null', () => {
        expect(
          reducer(
            { ...BASE_STATE, user: { name: 'Test User' } },
            { type: logout.fulfilled.type },
          ).user,
        ).toBeNull();
      });
    });

    describe(`${changePassword.fulfilled.type}`, () => {
      it(`sets changeStatus to ${status.PENDING}`, () => {
        expect(
          reducer(BASE_STATE, { type: changePassword.fulfilled.type })
            .changeStatus,
        ).toBe(status.PENDING);
      });
    });

    describe(`${resetPasswordRequest.fulfilled.type}`, () => {
      it(`sets resetStatus to ${status.PENDING}`, () => {
        expect(
          reducer(BASE_STATE, { type: resetPasswordRequest.fulfilled.type })
            .resetStatus,
        ).toBe(status.PENDING);
      });
    });

    describe(`${resetPasswordConfirm.fulfilled.type}`, () => {
      it(`sets resetStatus to ${status.COMPLETE}`, () => {
        expect(
          reducer(BASE_STATE, { type: resetPasswordConfirm.fulfilled.type })
            .resetStatus,
        ).toBe(status.COMPLETE);
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
      dispatch = jest.fn();
      getState = jest.fn(() => ({
        accounts: { userKey: '123' },
        missionControl: { currentCustomer: { id: '123' } },
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
        // fetchMock
        //   .once(JSON.stringify(createCustomerResponse))
        //   .once(JSON.stringify(createCustomerUserResponse))
        //   .once(JSON.stringify(fetchUserResponse));
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchUserResponse));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(createCustomerResponse),
        );
      });

      it('dispatches failure on create customer error', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test error'));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: registerCustomer.rejected.type }),
        );
      });

      it('creates a customer user and sets in state', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchUserResponse));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          createCustomerUserSuccess({ user: createCustomerUserResponse }),
        );
      });

      it('dispatches failure on customer user creation error', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.rejected.type,
          }),
        );
      });

      it('fetches the user after customer and customer user creation', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchUserResponse));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.fulfilled.type,
            payload: fetchUserResponse,
          }),
        );
      });

      it('dispatches the success action', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchUserResponse));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.fulfilled.type,
          }),
        );
      });

      it('navigates to order view', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchUserResponse));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER_ORDER));
      });

      it('dispatches failure on fetch user failure', async () => {
        server.use(
          rest.post('*/api/customers/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerResponse));
          }),
          rest.post('*/api/customers/:userId/users/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(createCustomerUserResponse));
          }),
          rest.get('*/api/users/:userId', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: registerCustomer.rejected.type,
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

      it('Uses the customer id from the user if current customer is undefined', async () => {
        server.use(
          rest.post('*/api/customers/:userId/orders/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(placeOrderResponseBody));
          }),
          rest.get('*/api/customers/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchCustomerResponseBody));
          }),
        );

        const origFetch = global.fetch;
        const fetchMock = jest.spyOn(window, 'fetch');

        await placeOrder(formValues)(dispatch, () => ({
          missionControl: { isLoading: false },
          accounts: {
            user: {
              customers: [
                { id: 'testcustomerId', type: 'MANAGER', status: 'ACTIVE' },
              ],
            },
          },
        }));

        expect(fetchMock).toHaveBeenNthCalledWith(
          1,
          expect.stringContaining('/api/customers/testcustomerId/orders/'),
          expect.anything(),
        );

        global.fetch = origFetch;
      });

      it('calls the success action on successful request', async () => {
        server.use(
          rest.post('*/api/customers/:userId/orders/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(placeOrderResponseBody));
          }),
          rest.get('*/api/customers/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchCustomerResponseBody));
          }),
        );

        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: placeOrder.fulfilled.type }),
        );
      });

      it('calls the failure action on failed request', async () => {
        server.use(
          rest.post('*/api/customers/:userId/orders/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
          rest.get('*/api/customers/:userId', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: placeOrder.rejected.type,
          }),
        );
      });

      it('fetches the updated customer and sets', async () => {
        server.use(
          rest.post('*/api/customers/:userId/orders/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(placeOrderResponseBody));
          }),
          rest.get('*/api/customers/:userId', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(fetchCustomerResponseBody));
          }),
        );

        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(fetchCustomerResponseBody),
        );
      });

      it('calls the failure action on fetch customer failure', async () => {
        server.use(
          rest.post('*/api/customers/:userId/orders/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(placeOrderResponseBody));
          }),
          rest.get('*/api/customers/:userId', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'));
          }),
        );

        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: placeOrder.rejected.type,
          }),
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

      const loginResponseUserNotVerified = {
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
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(
              ctx.status(418, 'Test Error'),
              ctx.json(loginResponseUserNotVerified),
            );
          }),
        );

        await login(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(push(RESEND_URL));
      });

      it('dispatches the failure action if the login request fails', async () => {
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(418, 'Test Error'), ctx.json(errorResponse));
          }),
        );

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
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(loginResponse));
          }),
          rest.get('*/api/users/current', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(getUserResponse));
          }),
        );

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
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(loginResponse));
          }),
          rest.get('*/api/users/current', (req, res, ctx) => {
            return res(ctx.status(418, 'Test Error'), ctx.json(errorResponse));
          }),
        );

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
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(loginResponse));
          }),
          rest.get('*/api/users/current', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(getUserResponse));
          }),
        );

        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push('/'));
      });

      it('navigates to REGISTER_CUSTOMER if the user needs to create a customer', async () => {
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(loginResponse));
          }),
          rest.get('*/api/users/current', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(getUserCustomerResponse));
          }),
        );

        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER));
      });

      it('navigates to REGISTER_CUSTOMER_ORDER if the user needs to place an order', async () => {
        server.use(
          rest.post('*/api/authentication/login/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(loginResponse));
          }),
          rest.get('*/api/users/current', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(getUserOrderResponse));
          }),
        );

        await login(formValues)(dispatch);
        expect(dispatch).toHaveBeenCalledWith(push(REGISTER_CUSTOMER_ORDER));
      });
    });

    describe('activateAccount', () => {
      it(`dispatches ${activateAccount.rejected.type} if the response is not ok`, async () => {
        server.use(
          rest.post(
            '*/api/authentication/registration/verify-email/',
            (req, res, ctx) => {
              return res(
                ctx.status(401, 'Test Error'),
                ctx.json({
                  errors: {
                    test: ['¿problema?'],
                  },
                }),
              );
            },
          ),
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
        server.use(
          rest.post(
            '*/api/authentication/registration/verify-email/',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({ user }));
            },
          ),
        );

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
        server.use(
          rest.post(
            '*/api/authentication/send-email-verification/',
            (req, res, ctx) => {
              return res(
                ctx.status(401, 'Test Error'),
                ctx.json(errorResponse),
              );
            },
          ),
        );

        await resendVerificationEmail('')(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: resendVerificationEmail.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${resendVerificationEmail.fulfilled.type} on success`, async () => {
        server.use(
          rest.post(
            '*/api/authentication/send-email-verification/',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            },
          ),
        );

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
        server.use(
          rest.post(
            '*/api/authentication/password/change/',
            (req, res, ctx) => {
              return res(
                ctx.status(401, 'Test Error'),
                ctx.json(errorResponse),
              );
            },
          ),
        );

        await changePassword({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: changePassword.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${changePassword.fulfilled.type} on success`, async () => {
        server.use(
          rest.post(
            '*/api/authentication/password/change/',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            },
          ),
        );

        await changePassword({})(dispatch, getState);
        expect(dispatch).toBeCalledWith(
          expect.objectContaining({ type: changePassword.fulfilled.type }),
        );
      });
    });

    describe('resetPasswordConfirm', () => {
      it(`dispatches ${resetPasswordConfirm.rejected.type} on failed request`, async () => {
        server.use(
          rest.post(
            '*/api/authentication/password/verify-reset/',
            (req, res, ctx) => {
              return res(
                ctx.status(401, 'Test Error'),
                ctx.json(errorResponse),
              );
            },
          ),
        );

        await resetPasswordConfirm({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: resetPasswordConfirm.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${resetPasswordConfirm.fulfilled.type} with user on success`, async () => {
        const user = { name: 'Test user' };
        server.use(
          rest.post(
            '*/api/authentication/password/verify-reset/',
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({ user }));
            },
          ),
        );

        await resetPasswordConfirm({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: resetPasswordConfirm.fulfilled.type,
            payload: user,
          }),
        );
      });
    });

    describe('resetPasswordRequest', () => {
      it(`dispatches ${resetPasswordRequest.rejected.type} on failed request`, async () => {
        server.use(
          rest.post('*/api/authentication/password/reset/', (req, res, ctx) => {
            return res(ctx.status(401, 'Test Error'), ctx.json(errorResponse));
          }),
        );

        await resetPasswordRequest({})(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: resetPasswordRequest.rejected.type,
            payload: errorResponse.errors.test,
          }),
        );
      });

      it(`dispatches ${resetPasswordRequest.fulfilled.type} on success`, async () => {
        server.use(
          rest.post('*/api/authentication/password/reset/', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          }),
        );

        await resetPasswordRequest({})(dispatch, getState);
        expect(dispatch).toBeCalledWith(
          expect.objectContaining({
            type: resetPasswordRequest.fulfilled.type,
          }),
        );
      });
    });
  });
});
