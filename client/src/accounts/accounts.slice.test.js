import {
  createCustomerUserSuccess,
  setCurrentCustomer,
} from 'admin/admin.slice';
import { push } from 'connected-react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  registerUserFailure,
  registerUserSuccess,
  registerUser,
  fetchUserSuccess,
  fetchUserFailure,
  fetchUser,
  loginUserFailure,
  loginUserSuccess,
  login,
  logoutUserSuccess,
  logoutUserFailure,
  logout,
  updateUserSuccess,
  updateUserFailure,
  updateUser,
  status,
  fetchRequested,
  registerCustomer,
  registerCustomerSuccess,
  registerCustomerFailure,
  placeOrder,
  placeOrderSuccess,
  placeOrderFailure,
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

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: registerUserFailure.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        },
      ];

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2',
      };
      await store.dispatch(registerUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch register success action.', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        { payload: {}, type: registerUserSuccess.type },
        {
          payload: { args: ['/accounts/resend'], method: 'push' },
          type: '@@router/CALL_HISTORY_METHOD',
        },
      ];

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

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: fetchUserFailure.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        },
      ];

      await store.dispatch(fetchUser());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch user success action.', async () => {
      const user = { username: 'testusername', email: 'testusername@test.com' };
      fetch.mockResponse(JSON.stringify(user));
      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        { type: fetchUserSuccess.type, payload: user },
      ];

      await store.dispatch(fetchUser());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch login failure action.', async () => {
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

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: loginUserFailure.type,
          payload: {
            errors: [
              'First error relating to failed request.',
              'Second error relating to failed request.',
              'Third error relating to failed request.',
            ],
          },
        },
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };
      await store.dispatch(login(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch login success action.', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: loginUserSuccess.type,
          payload: { userKey: userKey.token, user },
        },
        {
          payload: { args: ['/'], method: 'push' },
          type: '@@router/CALL_HISTORY_METHOD',
        },
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2',
      };

      await store.dispatch(login(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch logout failure action.', async () => {
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

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        {
          type: logoutUserFailure.type,
          payload: [
            'First error relating to failed request.',
            'Second error relating to failed request.',
            'Third error relating to failed request.',
          ],
        },
      ];

      await store.dispatch(logout());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch logout success action.', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [
        { type: fetchRequested.type, payload: undefined },
        { type: logoutUserSuccess.type },
      ];

      await store.dispatch(logout());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user failure action.', async () => {
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
    let beforeState;

    beforeEach(() => {
      beforeState = {
        userKey: null,
        user: null,
        error: null,
        isLoading: false,
        resetStatus: status.NONE,
        changeStatus: status.NONE,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the error state, on successful `register`', () => {
      const userKey = { token: 'Test Register Error' };

      const actualState = reducer(beforeState, {
        type: registerUserSuccess.type,
        payload: userKey,
      });

      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to `register`', () => {
      const error = 'Test Register Error';

      const actualState = reducer(beforeState, {
        type: registerUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user and key state, on successful login', () => {
      const userKey = { token: 'Test Login Error' };
      const user = { name: 'Test spammington' };

      const actualState = reducer(beforeState, {
        type: loginUserSuccess.type,
        payload: { userKey, user },
      });

      expect(actualState.userKey).toEqual(userKey);
      expect(actualState.user).toEqual(user);
    });

    it('should update the error state, when failed to `login`', () => {
      const error = 'Test Login Error';

      const actualState = reducer(beforeState, {
        type: loginUserFailure.type,
        payload: { errors: error },
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, when successfully fetched user', () => {
      const user = { id: 1, name: 'Test Fetch User Name' };

      const actualState = reducer(beforeState, {
        type: fetchUserSuccess.type,
        payload: user,
      });

      expect(actualState.user).toEqual(user);
    });

    it('should update the error state, when failed to fetch user', () => {
      const error = 'Test Fetch User Error';

      const actualState = reducer(beforeState, {
        type: fetchUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, when successfully updated user', () => {
      const user = { id: 1, name: 'Test Update User' };

      expect(beforeState.user).not.toEqual(user);

      const actualState = reducer(beforeState, {
        type: updateUserSuccess.type,
        payload: user,
      });

      expect(actualState.user).toEqual(user);
    });

    it('should update the error state, when failed to update user', () => {
      const error = 'Test Update User Error';

      const actualState = reducer(beforeState, {
        type: updateUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, on successful logout', () => {
      const user = { id: 1, name: 'Test Update User' };

      expect(beforeState.user).not.toEqual(user);

      const actualState = reducer(beforeState, {
        type: logoutUserSuccess.type,
      });

      expect(actualState.user).toEqual(null);
      expect(actualState.userKey).toEqual(null);
    });

    it('should update the error state, when failed to logout', () => {
      const error = 'Test Update User Error';

      const actualState = reducer(beforeState, {
        type: logoutUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
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

      it('starts the request', async () => {
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(fetchRequested());
      });

      it('creates new customer and sets in state', async () => {
        fetchMock.once(JSON.stringify(createCustomerResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(createCustomerResponse),
        );
      });

      it('dispatches failure on error', async () => {
        const errorResponse = { errors: { test: ['problem'] } };
        fetch.once(JSON.stringify(errorResponse), {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        });
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          registerCustomerFailure(['problem']),
        );
      });

      it('creates a customer user and sets in state', async () => {
        fetch
          .once(JSON.stringify(createCustomerResponse))
          .once(JSON.stringify(createCustomerUserResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          createCustomerUserSuccess({ user: createCustomerUserResponse }),
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

      const successResponseBody = {
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

      const failureResponseBody = {
        test: ['¿problema?'],
      };

      it('starts the request', async () => {
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(fetchRequested());
      });

      it('calls the success action on successful request', async () => {
        fetch.once(JSON.stringify(successResponseBody));
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(placeOrderSuccess());
      });

      it('navigates to landing on success', async () => {
        fetch.once(JSON.stringify(successResponseBody));
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(push('/'));
      });

      it('calls the failure action on failed request', async () => {
        fetch.once(JSON.stringify({ errors: failureResponseBody }), {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        });
        await placeOrder(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          placeOrderFailure({ errors: failureResponseBody.test }),
        );
      });
    });
  });
});
