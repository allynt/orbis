import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import reducer, {
  registerUserFailure,
  registerUserSuccess,
  register,
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
  updateUser
} from './accounts.slice';

const mockStore = configureMockStore([thunk]);

describe('Accounts Slice', () => {
  describe('Accounts Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: {
          userKey: 'testkey',
          user: { username: 'testusername', email: 'testusername@test.com' }
        }
      });
    });

    it('should dispatch register failure action.', async () => {
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

      const expectedActions = [{ type: registerUserFailure.type, payload: { message: '401 Test Error' } }];

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };
      await store.dispatch(register(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch register success action.', async () => {
      fetch.mockResponse(JSON.stringify({}));
      const expectedActions = [{ type: registerUserSuccess.type }];

      const form = {
        username: 'testusername',
        email: 'testusername@test.com',
        password1: 'password1',
        password2: 'password2'
      };

      await store.dispatch(register(form));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch user failure action.', async () => {
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

      const expectedActions = [{ type: fetchUserFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchUser());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch user success action.', async () => {
      const user = { username: 'testusername', email: 'testusername@test.com' };
      fetch.mockResponse(JSON.stringify(user));
      const expectedActions = [{ type: fetchUserSuccess.type, payload: user }];

      await store.dispatch(fetchUser());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch login failure action.', async () => {
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

      const expectedActions = [{ type: loginUserFailure.type, payload: { message: '401 Test Error' } }];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
      };
      await store.dispatch(login(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch login success action.', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [
        { type: loginUserSuccess.type, payload: userKey.token },
        { type: fetchUserSuccess.type, payload: user }
      ];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
      };

      await store.dispatch(login(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch logout failure action.', async () => {
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

      const expectedActions = [{ type: logoutUserFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(logout());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch logout success action.', async () => {
      const userKey = { token: 'testkey' };
      const user = { username: 'testusername', email: 'testusername@test.com' };

      fetch.once(JSON.stringify(userKey)).once(JSON.stringify(user));

      const expectedActions = [{ type: logoutUserSuccess.type }];

      await store.dispatch(logout());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user failure action.', async () => {
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

      const expectedActions = [{ type: updateUserFailure.type, payload: { message: '401 Test Error' } }];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
      };

      await store.dispatch(updateUser(form));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user success action.', async () => {
      const userKey = { token: 'testkey' };

      fetch.mockResponse(JSON.stringify(userKey));

      const expectedActions = [{ type: updateUserSuccess.type, payload: userKey }];

      const form = {
        email: 'testusername@test.com',
        password: 'password2'
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
        error: null
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
        payload: userKey
      });

      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to `register`', () => {
      const error = 'Test Register Error';

      const actualState = reducer(beforeState, {
        type: registerUserFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user key state, on successful login', () => {
      const userKey = { token: 'Test Login Error' };

      const actualState = reducer(beforeState, {
        type: loginUserSuccess.type,
        payload: userKey
      });

      expect(actualState.userKey).toEqual(userKey);
    });

    it('should update the error state, when failed to `login`', () => {
      const error = 'Test Login Error';

      const actualState = reducer(beforeState, {
        type: loginUserFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, when successfully fetched user', () => {
      const user = { id: 1, name: 'Test Fetch User Name' };

      const actualState = reducer(beforeState, {
        type: fetchUserSuccess.type,
        payload: user
      });

      expect(actualState.user).toEqual(user);
    });

    it('should update the error state, when failed to fetch user', () => {
      const error = 'Test Fetch User Error';

      const actualState = reducer(beforeState, {
        type: fetchUserFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, when successfully updated user', () => {
      const user = { id: 1, name: 'Test Update User' };

      expect(beforeState.user).not.toEqual(user);

      const actualState = reducer(beforeState, {
        type: updateUserSuccess.type,
        payload: user
      });

      expect(actualState.user).toEqual(user);
    });

    it('should update the error state, when failed to update user', () => {
      const error = 'Test Update User Error';

      const actualState = reducer(beforeState, {
        type: updateUserFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the user state, on successful logout', () => {
      const user = { id: 1, name: 'Test Update User' };

      expect(beforeState.user).not.toEqual(user);

      const actualState = reducer(beforeState, {
        type: logoutUserSuccess.type
      });

      expect(actualState.user).toEqual(null);
      expect(actualState.userKey).toEqual(null);
    });

    it('should update the error state, when failed to logout', () => {
      const error = 'Test Update User Error';

      const actualState = reducer(beforeState, {
        type: logoutUserFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });
  });
});
