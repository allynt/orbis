import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  REGISTER_REQUESTED_FAILURE,
  REGISTER_REQUESTED_SUCCESS,
  register,
  FETCH_USER_REQUESTED_FAILURE,
  FETCH_USER_REQUESTED_SUCCESS,
  LOGIN_REQUESTED_FAILURE,
  LOGIN_REQUESTED_SUCCESS,
  login,
  LOGOUT_REQUESTED_FAILURE,
  LOGOUT_REQUESTED_SUCCESS,
  logout,
  UPDATE_USER_REQUESTED_FAILURE,
  UPDATE_USER_REQUESTED_SUCCESS,
  updateUser
} from './accounts.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Account Actions', () => {
  describe('Account Registration', () => {
    let store;

    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      store = mockStore({});
    });

    it('should dispatch the REGISTER_REQUESTED_FAILURE action', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: REGISTER_REQUESTED_FAILURE, error: { message: '401 Test Error' } }];

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the REGISTER_REQUESTED_SUCCESS action', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = [{ type: REGISTER_REQUESTED_SUCCESS }];

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Login', () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        accounts: {
          userKey: 'testkey'
        }
      });
    });

    it('should dispatch the LOGIN_REQUESTED_FAILURE action on unsuccessful login', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: LOGIN_REQUESTED_FAILURE, error: { message: '401 Test Error' } }];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
      };

      await store.dispatch(login(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch LOGIN_REQUESTED_SUCCESS and FETCH_USER_REQUESTED_SUCCESS actions on successful login', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [
        { type: LOGIN_REQUESTED_SUCCESS, userKey: userKey.token },
        { type: FETCH_USER_REQUESTED_SUCCESS, user }
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
      };

      await store.dispatch(login(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Logout', () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        accounts: {
          userKey: 'testkey'
        }
      });
    });

    it('should dispatch the LOGOUT_REQUESTED_FAILURE action on unsuccessful logout', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: LOGOUT_REQUESTED_FAILURE, error: { message: '401 Test Error' } }];

      await store.dispatch(logout());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch LOGOUT_REQUESTED_SUCCESS action on successful logout', async () => {
      fetch.mockResponse(JSON.stringify({}));

      const expectedActions = [{ type: LOGOUT_REQUESTED_SUCCESS }];

      await store.dispatch(logout());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Account Profile', () => {
    let store = null;

    beforeEach(() => {
      store = mockStore({
        accounts: {
          userKey: '1234',
          user: {
            email: 'test@user.com'
          }
        }
      });
    });

    it('should dispatch the UPDATE_USER_REQUESTED_FAILURE action', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: UPDATE_USER_REQUESTED_FAILURE, error: { message: '401 Test Error' } }];

      const form = { id: 10, first_name: 'Test', last_name: 'User' };
      await store.dispatch(updateUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the UPDATE_USER_REQUESTED_SUCCESS action', async () => {
      const user = {
        username: 'testusername',
        email: 'test@user.com',
        first_name: 'Test',
        last_name: 'User'
      };
      fetch.mockResponse(JSON.stringify(user));
      const expectedActions = [{ type: UPDATE_USER_REQUESTED_SUCCESS, user }];

      const form = { id: 10, first_name: 'Test', last_name: 'User' };

      await store.dispatch(updateUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
