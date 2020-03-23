import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  CREATE_USER_REQUESTED,
  CREATE_USER_REQUESTED_SUCCESS,
  CREATE_USER_REQUESTED_FAILURE,
  createUser,
  USERS_REQUESTED,
  USERS_REQUESTED_SUCCESS,
  USERS_REQUESTED_FAILURE,
  fetchUsers,
  UPDATE_USER_REQUESTED,
  UPDATE_USER_REQUESTED_SUCCESS,
  UPDATE_USER_REQUESTED_FAILURE,
  updateUser,
  DELETE_USER_REQUESTED,
  DELETE_USER_REQUESTED_SUCCESS,
  DELETE_USER_REQUESTED_FAILURE,
  deleteUser
} from './users.actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Users Actions', () => {
  describe('Create User', () => {
    let initialState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      initialState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the CREATE_USER_REQUESTED_FAILURE action', async () => {
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

      const expectedActions = [
        { type: CREATE_USER_REQUESTED },
        { type: CREATE_USER_REQUESTED_FAILURE, error: { message: '401 Test Error' } }
      ];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };
      await store.dispatch(createUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the CREATE_USER_REQUESTED_SUCCESS action', async () => {
      const user = {};
      fetch.mockResponse(JSON.stringify(user, { status: 200 }));

      const expectedActions = [{ type: CREATE_USER_REQUESTED }, { type: CREATE_USER_REQUESTED_SUCCESS, user }];

      const store = mockStore(initialState);
      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(createUser(form));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Retrieve User', () => {
    let initialState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      initialState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the USERS_REQUESTED_FAILURE action', async () => {
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

      const expectedActions = [
        { type: USERS_REQUESTED },
        { type: USERS_REQUESTED_FAILURE, error: { message: '401 Test Error' } }
      ];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      await store.dispatch(fetchUsers());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the USERS_REQUESTED_SUCCESS action', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      fetch.mockResponse(JSON.stringify(users, { status: 200 }));

      const expectedActions = [{ type: USERS_REQUESTED }, { type: USERS_REQUESTED_SUCCESS, users }];

      const store = mockStore(initialState);

      await store.dispatch(fetchUsers());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Update User', () => {
    let initialState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      initialState = {
        users: null,
        isLoading: false,
        error: null
      };
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

      const expectedActions = [
        { type: UPDATE_USER_REQUESTED },
        { type: UPDATE_USER_REQUESTED_FAILURE, error: { message: '401 Test Error' } }
      ];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      const user = { id: 10 };
      await store.dispatch(updateUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the UPDATE_USER_REQUESTED_SUCCESS action', async () => {
      const user = { id: 10 };
      fetch.mockResponse(JSON.stringify(user, { status: 200 }));

      const expectedActions = [{ type: UPDATE_USER_REQUESTED }, { type: UPDATE_USER_REQUESTED_SUCCESS, user }];

      const store = mockStore(initialState);

      await store.dispatch(updateUser(user));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Delete User', () => {
    let initialState;

    beforeEach(() => {
      fetch.resetMocks();
      Object.defineProperty(document, 'cookie', {
        value: 'csrftoken=test'
      });

      initialState = {
        users: null,
        isLoading: false,
        error: null
      };
    });

    it('should dispatch the DELETE_USER_REQUESTED_FAILURE action if API not available', async () => {
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

      const expectedActions = [
        { type: DELETE_USER_REQUESTED },
        { type: DELETE_USER_REQUESTED_FAILURE, error: { message: '401 Test Error' } }
      ];

      const store = mockStore({
        accounts: {
          userKey: '1234'
        }
      });

      const user = { id: 10 };
      await store.dispatch(deleteUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch the DELETE_USER_REQUESTED_SUCCESS action', async () => {
      const id = 1;
      fetch.mockResponse(JSON.stringify(id, { status: 200 }));

      const expectedActions = [{ type: DELETE_USER_REQUESTED }, { type: DELETE_USER_REQUESTED_SUCCESS, id }];

      const store = mockStore(initialState);

      await store.dispatch(deleteUser(id));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
