import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchCustomerRequested,
  fetchCustomerSuccess,
  fetchCustomerFailure,
  fetchCustomer,
  fetchCustomerUsersRequested,
  fetchCustomerUsersSuccess,
  fetchCustomerUsersFailure,
  fetchCustomerUsers,
  deleteCustomerUserRequested,
  deleteCustomerUserSuccess,
  deleteCustomerUserFailure,
  deleteCustomerUser,
  updateCustomerUserRequested,
  updateCustomerUserSuccess,
  updateCustomerUserFailure,
  updateCustomerUser,
  createCustomerUserRequested,
  createCustomerUserSuccess,
  createCustomerUserFailure,
  createCustomerUser,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicencesAndAvailability,
} from './admin.slice';

const mockStore = configureMockStore([thunk]);

describe('Admin Slice', () => {
  describe('Actions', () => {
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
        { type: createCustomerUserRequested.type },
        { type: createCustomerUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      const user = {
        name: 'Test User',
      };
      await store.dispatch(createCustomerUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch create user success action.', async () => {
      const user = {
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [
        { type: createCustomerUserRequested.type },
        { type: createCustomerUserSuccess.type, payload: user },
      ];

      await store.dispatch(createCustomerUser(user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch users failure action.', async () => {
      const customer = {
        name: 'test_customer',
      };

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
        { type: fetchCustomerUsersRequested.type },
        { type: fetchCustomerUsersFailure.type, payload: { message: '401 Test Error' } },
      ];

      await store.dispatch(fetchCustomerUsers(customer));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch users success action.', async () => {
      const customer = {
        name: 'test_customer',
      };

      const users = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];

      fetch.mockResponse(JSON.stringify(users));

      const expectedActions = [
        { type: fetchCustomerUsersRequested.type },
        { type: fetchCustomerUsersSuccess.type, payload: users },
      ];

      await store.dispatch(fetchCustomerUsers(customer));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user failure action.', async () => {
      const customer = {
        name: 'test_customer',
      };

      const user = {
        name: 'Test User',
        id: 1,
      };

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
        { type: updateCustomerUserRequested.type },
        { type: updateCustomerUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      await store.dispatch(updateCustomerUser(customer, user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch update user success action.', async () => {
      const customer = {
        name: 'test_customer',
      };

      const user = {
        id: 1,
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [
        { type: updateCustomerUserRequested.type },
        { type: updateCustomerUserSuccess.type, payload: user },
      ];

      await store.dispatch(updateCustomerUser(customer, user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete user failure action.', async () => {
      const customer = {
        name: 'test_customer',
      };

      const user = {
        id: 1,
      };

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
        { type: deleteCustomerUserRequested.type },
        { type: deleteCustomerUserFailure.type, payload: { message: '401 Test Error' } },
      ];

      await store.dispatch(deleteCustomerUser(customer, user));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete user success action.', async () => {
      const customer = {
        name: 'test_customer',
      };

      const user = {
        id: 1,
        name: 'Test User',
      };

      fetch.mockResponse(JSON.stringify(user));

      const expectedActions = [
        { type: deleteCustomerUserRequested.type },
        { type: deleteCustomerUserSuccess.type, payload: user },
      ];

      await store.dispatch(deleteCustomerUser(customer, user));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        currentCustomer: null,
        customerUsers: null,
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
        type: fetchCustomerUsersRequested.type,
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
        type: fetchCustomerUsersSuccess.type,
        payload: users,
      });

      expect(actualState.customerUsers).toEqual(users);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to retrieve users', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: fetchCustomerUsersFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when deleting user", () => {
      const actualState = reducer(beforeState, {
        type: deleteCustomerUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully deleted user', () => {
      beforeState.customerUsers = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];
      const userToDelete = beforeState.customerUsers[1];

      const actualState = reducer(beforeState, {
        type: deleteCustomerUserSuccess.type,
        payload: userToDelete,
      });

      expect(actualState.customerUsers).toEqual(beforeState.customerUsers.filter(user => user.id !== userToDelete.id));
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to delete user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: deleteCustomerUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when updating user", () => {
      const actualState = reducer(beforeState, {
        type: updateCustomerUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully updated user', () => {
      beforeState.customerUsers = [
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
        ...beforeState.customerUsers[1],
      };
      userToUpdate.name = 'New Test User Name';

      const actualState = reducer(beforeState, {
        type: updateCustomerUserSuccess.type,
        payload: userToUpdate,
      });

      expect(actualState.customerUsers[1]).toEqual(userToUpdate);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to update user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: updateCustomerUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it("'should update the is loading state, when creating user", () => {
      const actualState = reducer(beforeState, {
        type: createCustomerUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully created user', () => {
      beforeState.customerUsers = [
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
        type: createCustomerUserSuccess.type,
        payload: userToCreate,
      });

      expect(actualState.customerUsers).toEqual([...beforeState.customerUsers, userToCreate]);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('should update the error state, when failed to create user', () => {
      const error = { message: 'Test Users Error' };

      const actualState = reducer(beforeState, {
        type: createCustomerUserFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });
  });

  describe('Selectors', () => {
    describe('selectCurrentCustomer', () => {
      it('returns the current customer', () => {
        const state = {
          admin: {
            currentCustomer: { title: 'test customer' },
          },
        };
        const result = selectCurrentCustomer(state);
        expect(result).toBe(state.admin.currentCustomer);
      });
    });

    describe('selectCustomerUsers', () => {
      it('returns customerUsers from state', () => {
        const state = {
          admin: {
            customerUsers: [{ id: 1 }, { id: 2 }],
          },
        };
        const result = selectCustomerUsers(state);
        expect(result).toEqual(state.admin.customerUsers);
      });
    });

    describe('selectLicencesAndAvailability', () => {
      it('Returns a list of unique licences', () => {
        const state = {
          admin: {
            currentCustomer: {
              licences: [
                {
                  id: 0,
                  orb: 'Rice',
                },
                {
                  id: 1,
                  orb: 'Oil',
                },
                {
                  id: 2,
                  orb: 'Rice',
                },
              ],
            },
          },
        };
        const expected = [
          { orb: 'Rice', available: true },
          { orb: 'Oil', available: true },
        ];
        const result = selectLicencesAndAvailability(state);
        expect(result).toEqual(expected);
      });

      it('Returns `available: false` for any orbs with all licences claimed', () => {
        const state = {
          admin: {
            currentCustomer: {
              licences: [
                {
                  id: 0,
                  orb: 'Rice',
                  customer_user: 'test@test.com',
                },
                {
                  id: 1,
                  orb: 'Oil',
                },
                {
                  id: 2,
                  orb: 'Rice',
                  customer_user: 'test@test.com',
                },
                { id: 3, orb: 'Oil', customer_user: null },
              ],
            },
          },
        };
        const expected = [
          { orb: 'Rice', available: false },
          { orb: 'Oil', available: true },
        ];
        const result = selectLicencesAndAvailability(state);
        expect(result).toEqual(expected);
      });

      const falsyTests = [
        ['empty', []],
        ['undefined', undefined],
        ['null', null],
      ];

      it.each(falsyTests)('returns an empty array if licences is %s', (_, value) => {
        const state = { admin: { currentCustomer: { licences: value } } };
        const result = selectLicencesAndAvailability(state);
        expect(result).toEqual([]);
      });
    });
  });
});
