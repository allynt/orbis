import fetch from 'jest-fetch-mock';
import { BookmarksClient } from './BookmarksClient';

describe('BookmarksClient', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getBookmarks', () => {
    it('Returns bookmarks from the response', async () => {
      const bookmarks = [{ id: 1 }, { id: 2 }];
      fetch.once(JSON.stringify(bookmarks));
      const client = new BookmarksClient();
      const responseBookmarks = await client.getBookmarks();
      expect(responseBookmarks).toEqual(bookmarks);
    });
  });

  describe('addBookmark', () => {
    const newBookmark = {
      center: [123, 456],
      zoom: 10,
      title: 'Test Bookmark',
    };
    const responseBookmark = {
      id: 123,
      ...newBookmark,
    };

    beforeEach(() => {
      fetch.once(JSON.stringify(responseBookmark));
    });

    it('Returns a newly created bookmark', async () => {
      const client = new BookmarksClient();
      const bookmark = await client.addBookmark(newBookmark);
      expect(bookmark).toEqual(responseBookmark);
    });
  });
});
