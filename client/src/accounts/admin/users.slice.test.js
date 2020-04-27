import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchUsersRequested,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUsers,
  deleteUserRequested,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUser,
  updateUserRequested,
  updateUserSuccess,
  updateUserFailure,
  updateUser,
  createUserRequested,
  createUserSuccess,
  createUserFailure,
  createUser,
} from './users.slice';

const mockStore = configureMockStore([thunk]);

describe('Users Slice', () => {
  describe('Users Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' },
      });
    });

    it('should dispatch create user failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: createUserRequested.type },
        { type: createUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      const user = {
        name: 'Test User',
      };
      await store.dispatch(createUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch create user success action.', async () => {
      const user = {
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [{ type: createUserRequested.type }, { type: createUserSuccess.type, payload: user }];

      await store.dispatch(createUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch users failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: fetchUsersRequested.type },
        { type: fetchUsersFailure.type, payload: { message: '401 Test Error' } },
      ];

      await store.dispatch(fetchUsers());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch users success action.', async () => {
      const users = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];

      fetch.mockResponse(JSON.stringify(users));

      const expectedActions = [{ type: fetchUsersRequested.type }, { type: fetchUsersSuccess.type, payload: users }];

      await store.dispatch(fetchUsers());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: updateUserRequested.type },
        { type: updateUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      const user = {
        name: 'Test User',
      };

      await store.dispatch(updateUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user success action.', async () => {
      const user = {
        id: 1,
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [{ type: updateUserRequested.type }, { type: updateUserSuccess.type, payload: user }];

      await store.dispatch(updateUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete user failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: deleteUserRequested.type },
        { type: deleteUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      const user = {
        id: 1,
      };

      await store.dispatch(deleteUser(user.id));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete user success action.', async () => {
      const user = {
        id: 1,
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [{ type: deleteUserRequested.type }, { type: deleteUserSuccess.type, payload: user.id }];

      await store.dispatch(deleteUser(user.id));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Users Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        users: null,
        isLoading: false,
        error: null,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it("'should update the is loading state, when users requested", () => {
      const actualState = reducer(beforeState, {
        type: fetchUsersRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully retrieved', () => {
      const users = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];

      const actualState = reducer(beforeState, {
        type: fetchUsersSuccess.type,
        payload: users,
      });

      expect(actualState.users).toEqual(users);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to retrieve users', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: fetchUsersFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when deleting user", () => {
      const actualState = reducer(beforeState, {
        type: deleteUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully deleted user', () => {
      beforeState.users = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];
      const userToDelete = beforeState.users[1];

      const actualState = reducer(beforeState, {
        type: deleteUserSuccess.type,
        payload: userToDelete.id,
      });

      expect(actualState.users).toEqual(beforeState.users.filter(user => user.id !== userToDelete.id));
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to delete user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: deleteUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when updating user", () => {
      const actualState = reducer(beforeState, {
        type: updateUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully updated user', () => {
      beforeState.users = [
        {
          id: 1,
          name: 'Test User 1',
        },
        {
          id: 2,
          name: 'Test User 1',
        },
      ];
      const userToUpdate = {
        ...beforeState.users[1],
      };
      userToUpdate.name = 'New Test User Name';

      const actualState = reducer(beforeState, {
        type: updateUserSuccess.type,
        payload: userToUpdate,
      });

      expect(actualState.users[1]).toEqual(userToUpdate);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to update user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: updateUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when creating user", () => {
      const actualState = reducer(beforeState, {
        type: createUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully created user', () => {
      beforeState.users = [
        {
          id: 1,
          name: 'Test User 1',
        },
        {
          id: 2,
          name: 'Test User 1',
        },
      ];
      const userToCreate = {
        id: 3,
        name: 'Test User 3',
      };

      const actualState = reducer(beforeState, {
        type: createUserSuccess.type,
        payload: userToCreate,
      });

      expect(actualState.users).toEqual([...beforeState.users, userToCreate]);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to create user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: createUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });
  });
});
