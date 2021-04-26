import fetch from 'jest-fetch-mock';
import { BookmarksClient } from './BookmarksClient';

describe('BookmarksClient', () => {
  describe('getBookmarks', () => {
    it('Returns bookmarks from the response', async () => {
      const bookmarks = [{ id: 1 }, { id: 2 }];
      fetch.once(JSON.stringify(bookmarks));
      const client = new BookmarksClient();
      const responseBookmarks = await client.getBookmarks();
      expect(responseBookmarks).toEqual(bookmarks);
    });
  });
});
