import fetch from 'jest-fetch-mock';

import { BookmarksClient } from './BookmarksClient';

fetch.enableMocks();

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

  describe('deleteBookmark', () => {
    it('deletes the bookmark', async () => {
      const client = new BookmarksClient();
      await client.deleteBookmark(1);
      expect(fetch).toBeCalledWith(
        expect.stringContaining('/api/bookmarks/1'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
