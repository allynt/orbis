import fetch from 'jest-fetch-mock';

import { UsersClient } from './UsersClient';

fetch.enableMocks();

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
      fetch.once(JSON.stringify(user));
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
      fetch.once(JSON.stringify(user));
      expect(client.getUser(123)).resolves.toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('Returns the updated user', () => {
      const updatedUser = {
        name: 'Test User',
        email: 'test@test.com',
      };
      fetch.once(JSON.stringify(updatedUser));
      expect(client.updateUser(updatedUser)).resolves.toEqual(updatedUser);
    });
  });
});
