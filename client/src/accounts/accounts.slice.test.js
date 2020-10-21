import { setCurrentCustomer } from 'admin/admin.slice';
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
    describe('registerCustomer', () => {
      let dispatch;
      let getState;
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
      beforeEach(() => {
        dispatch = jest.fn();
        getState = jest.fn(() => ({ accounts: { userKey: '123' } }));
      });
      it('starts the request', async () => {
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(fetchRequested());
      });

      it('dispatches success and sets customer on successful creation', async () => {
        const createCustomerResponse = {
          id: '311221cb-fe5b-43aa-b48e-027cfb460615',
          type: 'MULTIPLE',
          name: formValues.customerName,
          official_name: formValues.customerNameOfficial,
          company_type: formValues.customerType,
          registered_id: formValues.registeredNumber,
        };

        fetchMock.once(JSON.stringify(createCustomerResponse));
        await registerCustomer(formValues)(dispatch, getState, undefined);
        expect(dispatch).toHaveBeenCalledWith(
          setCurrentCustomer(createCustomerResponse),
        );
        expect(dispatch).toHaveBeenCalledWith(registerCustomerSuccess());
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
    });
  });
});
