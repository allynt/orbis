import { rest } from 'msw';

import { server } from 'mocks/server';

import { UsersClient } from './UsersClient';

describe('UsersClient', () => {
  /** @type {UsersClient} */
  let client;

  beforeEach(() => {
    client = new UsersClient();
  });

  describe('getCurrentUser', () => {
    it('Returns the current user', () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      };

      server.use(
        rest.get('*/api/users/current', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(user));
        }),
      );

      expect(client.getCurrentUser()).resolves.toEqual(user);
    });
  });

  describe('getUser', () => {
    it('Returns the user', () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
      };

      server.use(
        rest.get('*/api/users/:userId', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(user));
        }),
      );

      expect(client.getUser(123)).resolves.toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('Returns the updated user', () => {
      const updatedUser = {
        name: 'Test User',
        email: 'test@test.com',
      };

      server.use(
        rest.put('*/api/users/:userId', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(updatedUser));
        }),
      );

      expect(client.updateUser(updatedUser)).resolves.toEqual(updatedUser);
    });
  });
});
