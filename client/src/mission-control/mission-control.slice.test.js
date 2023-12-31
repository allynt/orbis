import { rest } from 'msw';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { setUser } from 'accounts/accounts.slice';
import { fetchSources } from 'data-layers/data-layers.slice';
import { server } from 'mocks/server';

import { USER_STATUS } from './mission-control.constants';
import reducer, {
  toggleMissionControlDialog,
  selectIsMissionControlDialogVisible,
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
  inviteCustomerUserRequested,
  inviteCustomerUserSuccess,
  inviteCustomerUserFailure,
  inviteCustomerUser,
  createCustomerUserRequested,
  createCustomerUserSuccess,
  createCustomerUserFailure,
  createCustomerUser,
  updateCustomerRequested,
  updateCustomerSuccess,
  updateCustomerFailure,
  updateCustomer,
  selectCurrentCustomer,
  selectCustomerUsers,
  selectLicenceInformation,
} from './mission-control.slice';

const mockStore = configureMockStore([thunk]);

describe('Mission Control Slice', () => {
  describe('Actions', () => {
    let store = null;

    beforeEach(() => {
      store = mockStore({
        accounts: { userKey: 'Test-User-Key', user: {} },
        missionControl: {
          isMissionControlDialogVisible: false,
          currentCustomer: {
            id: 1,
            name: 'test-customer',
            licences: [{ id: 1, orb: 'Rice' }],
          },
          customerUsers: [],
        },
      });
    });

    describe('updateCustomer', () => {
      it('should dispatch update customer failure action.', async () => {
        const customer = {
          id: 1,
          name: 'test_customer',
        };

        server.use(
          rest.put(`*/api/customers/${customer.id}`, (req, res, ctx) => {
            return res(
              ctx.status(401),
              ctx.json({ errors: { name: ['Test error message'] } }),
            );
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: updateCustomer.rejected.type,
            payload: { message: '401 Unauthorized' },
          }),
        ]);

        await store.dispatch(updateCustomer(customer));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch update customer success action.', async () => {
        const customer = {
          id: 1,
          name: 'test_customer',
        };

        server.use(
          rest.get(`*/api/customers/${customer.id}/users/`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(customer));
          }),
          rest.put(`*/api/customers/${customer.id}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(customer));
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: 'missionControl/updateCustomerSuccess',
            payload: customer,
          }),
        ]);

        await store.dispatch(updateCustomer(customer));
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('fetchCustomerUsers', () => {
      it('should dispatch fetch users failure action.', async () => {
        const customer = {
          id: 1,
          name: 'test_customer',
        };

        server.use(
          rest.get(`*/api/customers/${customer.id}/users/`, (req, res, ctx) => {
            return res(
              ctx.status(401),
              ctx.json({ errors: { name: ['Test error message'] } }),
            );
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: fetchCustomerUsers.rejected.type,
            payload: { message: '401 Unauthorized' },
          }),
        ]);

        await store.dispatch(fetchCustomerUsers(customer));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch fetch users success action.', async () => {
        const customer = {
          id: 1,
          name: 'test_customer',
        };

        const users = [
          {
            id: '1',
          },
          {
            id: '2',
          },
        ];

        server.use(
          rest.get(`*/api/customers/${customer.id}/users/`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(users));
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: fetchCustomerUsersRequested.type,
          }),
          expect.objectContaining({
            type: fetchCustomerUsersSuccess.type,
            payload: users,
          }),
        ]);

        await store.dispatch(fetchCustomerUsers(customer));
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('createCustomerUser', () => {
      describe('should dispatch create user failure action.', () => {
        it('on create user failure', async () => {
          const customer = {
            id: 1,
            name: 'test_customer',
          };
          const url = `*/api/customers/${customer.id}/users/`;
          server.use(
            rest.post(url, (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            }),
            rest.get(url, (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            }),
          );

          const expectedActions = expect.arrayContaining([
            expect.objectContaining({
              type: createCustomerUserRequested.type,
            }),
            expect.objectContaining({
              type: createCustomerUser.rejected.type,
              payload: { message: '401 Unauthorized' },
            }),
          ]);

          const user = {
            name: 'Test User',
            licences: [],
          };
          await store.dispatch(createCustomerUser(user));
          expect(store.getActions()).toEqual(expectedActions);
        });

        it('on fetch customer failure', async () => {
          const customer = {
            id: 1,
            name: 'test_customer',
            customers: [{ id: 1, name: 'test_customer' }],
          };

          server.use(
            rest.post(
              `*/api/customers/${customer.id}/users/`,
              (req, res, ctx) => {
                return res(ctx.status(200), ctx.json({ name: 'User' }));
              },
            ),
            rest.get(`*/api/customers/${customer.id}`, (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            }),
            rest.get(
              `*/api/customers/${customer.id}/users/`,
              (req, res, ctx) => {
                return res(
                  ctx.status(401),
                  ctx.json({ errors: { name: ['Test error message'] } }),
                );
              },
            ),
          );

          const expectedActions = expect.arrayContaining([
            expect.objectContaining({
              type: createCustomerUserRequested.type,
            }),
            expect.objectContaining({
              type: createCustomerUser.rejected.type,
              payload: { message: '401 Unauthorized' },
            }),
          ]);

          const user = {
            name: 'Test User',
            licences: [],
          };
          await store.dispatch(createCustomerUser(user));
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it('should dispatch create user success action.', async () => {
        const user = {
          name: 'Test User',
          licences: [],
        };
        const customer = {
          id: 1,
          name: 'test-customer',
        };

        const customerUsersUrl = `*/api/customers/${customer.id}/users/`;
        const customerUrl = `*/api/customers/${customer.id}`;
        server.use(
          rest.post(customerUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(user));
          }),
          rest.get(customerUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(customer));
          }),
          rest.post(customerUsersUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(user));
          }),
          rest.get(customerUsersUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(customer));
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: 'missionControl/createCustomerUserSuccess',
            payload: { user, customer },
          }),
        ]);

        await store.dispatch(createCustomerUser(user));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('Sets the licences on the new user to IDs of available licences', async () => {
        store = mockStore({
          accounts: { userKey: 'Test-User-Key' },
          missionControl: {
            currentCustomer: {
              id: 2,
              name: 'test-customer',
              licences: [
                { id: '1', orb: 'Rice' },
                { id: '2', orb: 'Rice', customer_user: '1' },
                { id: '3', orb: 'Oil' },
              ],
            },
            customerUsers: [{ id: '1', licences: ['2'] }],
          },
        });
        const request = {
          name: 'Test User',
          email: 'test.user@test.com',
          licences: ['Rice', 'Oil'],
        };
        const expectedCustomerUser = {
          id: 2,
          status: 'PENDING',
          type: 'MEMBER',
          licences: ['1', '3'],
          user: {
            name: 'Test User',
            email: 'test.user@test.com',
          },
        };

        const customerUsersUrl = `*/api/customers/${expectedCustomerUser.id}/users/`;
        const customerUrl = `*/api/customers/${expectedCustomerUser.id}`;
        server.use(
          rest.post(customerUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(expectedCustomerUser));
          }),
          rest.get(customerUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(expectedCustomerUser));
          }),
          rest.post(customerUsersUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(expectedCustomerUser));
          }),
          rest.get(customerUsersUrl, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(expectedCustomerUser));
          }),
        );

        const response = await store.dispatch(createCustomerUser(request));
        expect(response.payload.payload.user).toEqual(expectedCustomerUser); //@TODO reshaped data!
      });
    });

    describe('updateCustomerUser', () => {
      it('should dispatch update user failure action.', async () => {
        const customer = {
          id: 1,
          name: 'test_customer',
        };

        const user = {
          id: 1,
          name: 'Test User',
          email: 'test.user@test.com',
        };

        const customerUser = {
          id: '1',
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: user,
        };

        const data = {
          ...customerUser,
          user: {
            ...user,
            name: 'Updated User Name',
          },
        };

        server.use(
          rest.put(
            `*/api/customers/${customer.id}/users/${user.id}/`,
            (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            },
          ),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: updateCustomerUserRequested.type,
          }),
          expect.objectContaining({
            type: updateCustomerUserFailure.type,
            payload: { message: '401 Unauthorized' },
          }),
        ]);

        await store.dispatch(updateCustomerUser(customerUser, data));

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch update user success action.', async () => {
        const updatedCustomer = {
          id: 1,
          name: 'test_customer',
        };

        const updatedCustomerUser = {
          id: 1,
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: {
            id: '1',
            name: 'Test User',
            email: 'test.user@test.com',
          },
        };

        server.use(
          rest.put(
            `*/api/customers/${updatedCustomer.id}/users/${updatedCustomerUser.id}/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(updatedCustomerUser));
            },
          ),
          rest.get(`*/api/customers/${updatedCustomer.id}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(updatedCustomer));
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: updateCustomerUserRequested.type,
          }),
          expect.objectContaining({
            type: updateCustomerUserSuccess.type,
            payload: {
              updatedCustomerUser,
              updatedCustomer,
            },
          }),
        ]);

        await store.dispatch(updateCustomerUser(updatedCustomerUser));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it("Should update the current user if it's the current user being updated", async () => {
        store = mockStore({
          accounts: { userKey: '123', user: { id: 1, name: 'Something' } },
          missionControl: {
            isMissionControlDialogVisible: false,
            currentCustomer: {
              id: 1,
              name: 'test-customer',
              licences: [{ id: 1, orb: 'Rice' }],
            },
            customerUsers: [],
          },
        });

        const updatedCustomerUser = {
          user: { id: 1, name: 'Test Name' },
          licences: [{ id: 1 }],
        };
        const updatedCustomer = {
          id: 1,
          name: 'test_customer',
        };

        server.use(
          rest.put(
            `*/api/customers/${updatedCustomer.id}/users/${updatedCustomerUser.user.id}/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(updatedCustomerUser));
            },
          ),
          rest.get(`*/api/customers/${updatedCustomer.id}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(updatedCustomer));
          }),
          rest.get(`*/api/users/current`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(updatedCustomerUser.user));
          }),
        );

        await store.dispatch(updateCustomerUser(updatedCustomerUser));
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: setUser.type,
            payload: updatedCustomerUser.user,
          }),
        );
      });

      it("Should refetch sources if the user's licences have changed", async () => {
        store = mockStore({
          data: {},
          accounts: {
            userKey: '123',
            user: { id: 1, name: 'Something', orbs: [{ name: 'Rice' }] },
          },
          missionControl: {
            currentCustomer: {
              id: 1,
              name: 'test-customer',
              licences: [{ id: 1, orb: 'Rice' }],
            },
            customerUsers: [],
          },
        });

        const updatedCustomerUser = {
          user: { id: 1, name: 'Test Name' },
          licences: [{ id: 1 }, { id: '2' }],
        };
        const updatedCustomer = {
          id: 1,
          name: 'test_customer',
        };

        server.use(
          rest.put(
            `*/api/customers/${updatedCustomer.id}/users/${updatedCustomerUser.user.id}/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(updatedCustomerUser));
            },
          ),
          rest.get(`*/api/customers/${updatedCustomer.id}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(updatedCustomer));
          }),
          rest.get(`*/api/users/current`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(updatedCustomerUser.user));
          }),
          rest.get(`*/api/data/sources`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({}));
          }),
        );

        await store.dispatch(updateCustomerUser(updatedCustomerUser));
        expect(store.getActions()).toContainEqual(
          expect.objectContaining({
            type: fetchSources.pending.type,
          }),
        );
      });
    });

    describe('inviteCustomerUser', () => {
      it('should dispatch invite customer user failure action', async () => {
        const customerUser = {
          id: 1,
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: {
            id: 1,
            name: 'Test User',
            email: 'test.user@test.com',
          },
        };

        server.use(
          rest.post(
            `*/api/customers/${customerUser.id}/users/${customerUser.user.id}/invite/`,
            (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            },
          ),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: inviteCustomerUserRequested.type,
          }),
          expect.objectContaining({
            type: inviteCustomerUserFailure.type,
            payload: { message: '401 Unauthorized' },
          }),
        ]);

        await store.dispatch(inviteCustomerUser(customerUser));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch invite customer user success action', async () => {
        const invitedCustomerUser = {
          id: 1,
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: {
            id: 1,
            name: 'Test User',
            email: 'test.user@test.com',
          },
        };

        server.use(
          rest.post(
            `*/api/customers/${invitedCustomerUser.id}/users/${invitedCustomerUser.user.id}/invite/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(invitedCustomerUser));
            },
          ),
          rest.get(
            `*/api/customers/${invitedCustomerUser.id}/users/${invitedCustomerUser.user.id}/invite/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(invitedCustomerUser));
            },
          ),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: inviteCustomerUserRequested.type,
          }),
          expect.objectContaining({
            type: inviteCustomerUserSuccess.type,
            payload: {
              invitedCustomerUser,
            },
          }),
        ]);

        await store.dispatch(inviteCustomerUser(invitedCustomerUser));

        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('deleteCustomerUser', () => {
      it('should dispatch delete user failure action.', async () => {
        const customerUser = {
          id: 1,
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: {
            id: 1,
            name: 'Test User',
            email: 'test.user@test.com',
          },
        };

        server.use(
          rest.delete(
            `*/api/customers/${customerUser.id}/users/${customerUser.user.id}/`,
            (req, res, ctx) => {
              return res(
                ctx.status(401),
                ctx.json({ errors: { name: ['Test error message'] } }),
              );
            },
          ),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: deleteCustomerUserRequested.type,
          }),
          expect.objectContaining({
            type: deleteCustomerUserFailure.type,
            payload: { message: '401 Unauthorized' },
          }),
        ]);

        await store.dispatch(deleteCustomerUser(customerUser));
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should dispatch delete user success action.', async () => {
        const customer = {
          name: 'test_customer',
        };

        const user = {
          id: 1,
          name: 'Test User',
          email: 'test.user@test.com',
        };

        const customerUser = {
          id: 1,
          status: 'PENDING',
          type: 'MEMBER',
          licences: [],
          user: user,
        };

        server.use(
          rest.delete(
            `*/api/customers/${customerUser.id}/users/${user.id}/`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json(user));
            },
          ),
          rest.get(`*/api/customers/${customerUser.id}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(customer));
          }),
        );

        const expectedActions = expect.arrayContaining([
          expect.objectContaining({
            type: deleteCustomerUserRequested.type,
            payload: undefined,
          }),
          expect.objectContaining({
            type: deleteCustomerUserSuccess.type,
            payload: { deletedUser: customerUser, customer },
          }),
        ]);

        await store.dispatch(deleteCustomerUser(customerUser));
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        isMissionControlDialogVisible: false,
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

    it('should update the isMissionControlDialogVisible state', () => {
      const result = reducer(beforeState, {
        type: toggleMissionControlDialog.type,
        payload: true,
      });
      expect(result.isMissionControlDialogVisible).toBe(true);
    });

    it('should update the is loading state, when users requested', () => {
      const actualState = reducer(beforeState, {
        type: fetchCustomerUsersRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully retrieved', () => {
      const users = [
        {
          id: '1',
        },
        {
          id: '2',
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

    it('should update the users and customer in state, when successfully deleted user', () => {
      beforeState.customerUsers = [
        {
          id: '1',
        },
        {
          id: '2',
        },
      ];

      beforeState.currentCustomer = {
        licences: [{ customer_user: '1' }, { customer_user: '2' }],
      };
      const userToDelete = beforeState.customerUsers[1];

      const actualState = reducer(beforeState, {
        type: deleteCustomerUserSuccess.type,
        payload: {
          deletedUser: userToDelete,
          customer: {
            ...beforeState.customer,
            licences: [{ customer_user: '1' }, { customer_user: null }],
          },
        },
      });

      expect(actualState.customerUsers).toEqual(
        beforeState.customerUsers.filter(user => user.id !== userToDelete.id),
      );
      expect(actualState.currentCustomer.licences).toEqual([
        { customer_user: '1' },
        { customer_user: null },
      ]);
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

    it('should update the is loading state, when updating user', () => {
      const actualState = reducer(beforeState, {
        type: updateCustomerUserRequested.type,
      });

      expect(actualState.isLoading).toEqual(true);
    });

    it('should update the users in state, when successfully updated user', () => {
      beforeState.customerUsers = [
        {
          id: '1',
          name: 'Test User 1',
        },
        {
          id: '2',
          name: 'Test User 2',
        },
      ];
      const userToUpdate = {
        ...beforeState.customerUsers[1],
      };
      userToUpdate.name = 'New Test User Name';

      const actualState = reducer(beforeState, {
        type: updateCustomerUserSuccess.type,
        payload: { updatedCustomerUser: userToUpdate },
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
          id: '1',
          name: 'Test User 1',
        },
        {
          id: '2',
          name: 'Test User 1',
        },
      ];
      const userToCreate = {
        id: '3',
        name: 'Test User 3',
      };

      const actualState = reducer(beforeState, {
        type: createCustomerUserSuccess.type,
        payload: { user: userToCreate },
      });

      expect(actualState.customerUsers).toEqual([
        ...beforeState.customerUsers,
        userToCreate,
      ]);
      expect(actualState.isLoading).toEqual(false);
      expect(actualState.error).toEqual(null);
    });

    it('updates the current customer after creating a user', () => {
      beforeState.currentCustomer = { name: 'previous' };
      const customer = {
        name: 'current',
      };

      const result = reducer(
        beforeState,
        createCustomerUserSuccess({ customer }),
      );
      expect(result.currentCustomer).toEqual(customer);
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
    describe('selectIsMissionControlDialogVisible', () => {
      it('returns `isMissionControlDialogVisible` boolean value', () => {
        const state = {
          missionControl: {
            isMissionControlDialogVisible: false,
          },
        };

        const result = selectIsMissionControlDialogVisible(state);
        expect(result).toEqual(false);
      });
    });

    describe('selectCurrentCustomer', () => {
      it('returns the current customer', () => {
        const state = {
          missionControl: {
            currentCustomer: { title: 'test customer' },
          },
        };
        const result = selectCurrentCustomer(state);
        expect(result).toBe(state.missionControl.currentCustomer);
      });
    });

    describe('selectCustomerUsers', () => {
      it('returns customerUsers from state', () => {
        const state = {
          missionControl: {
            customerUsers: [{ id: '1' }, { id: '2' }],
          },
        };
        const result = selectCustomerUsers(state);
        expect(result).toEqual(state.missionControl.customerUsers);
      });
    });

    describe('selectLicenceInformation', () => {
      const state = {
        missionControl: {
          currentCustomer: {
            licences: [
              { orb: 'Rice' },
              { orb: 'Rice', customer_user: '2' },
              { orb: 'Rice', customer_user: '1' },
              { orb: 'Oil', customer_user: '1' },
              { orb: 'Oil', customer_user: '3' },
              { orb: 'Health', customer_user: '4' },
              { orb: 'Health', customer_user: '3' },
              { orb: 'Health', customer_user: '2' },
              { orb: 'Health' },
              { orb: 'Health' },
            ],
          },
          customerUsers: [
            { id: '1', status: USER_STATUS.active },
            { id: '2', status: USER_STATUS.active },
            { id: '3', status: USER_STATUS.pending },
            { id: '4', status: USER_STATUS.pending },
          ],
        },
      };

      it('creates an entry for each orb', () => {
        const result = selectLicenceInformation(state);
        expect(Object.keys(result)).toEqual(['Rice', 'Oil', 'Health']);
      });

      it('calculates purchased amount', () => {
        const result = selectLicenceInformation(state);
        [
          ['Rice', 3],
          ['Oil', 2],
          ['Health', 5],
        ].forEach(([orb, count]) => expect(result[orb].purchased).toBe(count));
      });

      it('calculates available amount', () => {
        const result = selectLicenceInformation(state);
        [
          ['Rice', 1],
          ['Oil', 0],
          ['Health', 2],
        ].forEach(([orb, count]) => expect(result[orb].available).toBe(count));
      });

      it('calculates active amount', () => {
        const result = selectLicenceInformation(state);
        [
          ['Rice', 2],
          ['Oil', 1],
          ['Health', 1],
        ].forEach(([orb, count]) => expect(result[orb].active).toBe(count));
      });

      it('calculates pending count', () => {
        const result = selectLicenceInformation(state);
        [
          ['Rice', 0],
          ['Oil', 1],
          ['Health', 2],
        ].forEach(([orb, count]) => expect(result[orb].pending).toBe(count));
      });
    });
  });
});
