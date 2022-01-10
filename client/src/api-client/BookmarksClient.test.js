import { BookmarksClient } from './BookmarksClient';

describe('BookmarksClient', () => {
  let client = null;

  beforeEach(() => {
    client = new BookmarksClient();
    client.userKey = '5edd4615-34a7-4c55-9243-0092671ef9d8';
  });

  describe('getBookmarks', () => {
    it('Returns bookmarks from the response', async () => {
      const bookmarks = [
        {
          id: 4,
          owner: '5edd4615-34a7-4c55-9243-0092671ef9d8',
          title: 'Malaysia',
          description:
            'This is a description paragraph that describes the contents of this bookmark.',
          created: '2020-01-31T11:44:25.398622Z',
          zoom: 9.32646036279396,
          center: [100.616221, 5.804306],
          feature_collection: { type: 'FeatureCollection', features: [] },
          thumbnail:
            'https://s3.amazonaws.com/images.spaceref.com/news/2018/esa_earth_from_space_shanghai_china_071318_945.jpg',
        },
      ];

      const response = await client.getBookmarks();

      expect(response).toEqual(bookmarks);
    });
  });

  describe('addBookmark', () => {
    const newBookmark = {
      title: 'Test Bookmark',
      description: '',
      center: [123, 456],
      zoom: 10,
      owner: '123',
      thumbnail: new Blob([JSON.stringify({ hello: 'world' }, null, 2)], {
        type: 'application/json',
      }),
      layers: ['layer-1', 'layer-2', 'layer-3'],
      orbs: ['orbs-1', 'orbs-2', 'orbs-3'],
      drawn_feature_collection: 'FeatureCollection',
    };

    it('Returns a newly created bookmark', async () => {
      const response = await client.addBookmark(newBookmark);

      const expectedResponse = {
        title: 'Test Bookmark',
        description: '',
        center: [123, 456],
        zoom: 10,
        owner: '123',
        thumbnail:
          'http://localhost:8000/api/bookmarks/media/123/test-bookmark.png',
        layers: ['layer-1', 'layer-2', 'layer-3'],
      };

      expect(response).toEqual(expect.objectContaining(expectedResponse));
    });
  });

  describe('deleteBookmark', () => {
    it('deletes the bookmark', async () => {
      const bookmarks = [
        {
          id: 2,
          owner: '6e5ac533-0245-4031-ab65-b1eff4d30a1f',
          title: 'Guatemala',
          description:
            'This is a description paragraph that describes the contents of this bookmark.',
          created: '2020-01-31T11:52:09.571808Z',
          zoom: 5.23484291387757,
          center: [-86.87191, 17.438782],
          feature_collection: { type: 'FeatureCollection', features: [] },
          thumbnail:
            'https://cdn.mos.cms.futurecdn.net/PuMd7Vw3wsZafT27T2xWtF.jpg',
        },
        {
          id: 3,
          owner: '6e5ac533-0245-4031-ab65-b1eff4d30a1f',
          title: 'Vietnam',
          description:
            'This is a description paragraph that describes the contents of this bookmark.',
          created: '2020-01-31T11:46:12.618090Z',
          zoom: 7.1319501464789,
          center: [108.312151, 20.053918],
          feature_collection: { type: 'FeatureCollection', features: [] },
          thumbnail:
            'https://spacewatch.global/wp-content/uploads/2019/10/Vietnam.A2002092.0330.500m.jpg',
        },
        {
          id: 4,
          owner: '5edd4615-34a7-4c55-9243-0092671ef9d8',
          title: 'Malaysia',
          description:
            'This is a description paragraph that describes the contents of this bookmark.',
          created: '2020-01-31T11:44:25.398622Z',
          zoom: 9.32646036279396,
          center: [100.616221, 5.804306],
          feature_collection: { type: 'FeatureCollection', features: [] },
          thumbnail:
            'https://s3.amazonaws.com/images.spaceref.com/news/2018/esa_earth_from_space_shanghai_china_071318_945.jpg',
        },
      ];

      const response = await client.deleteBookmark(1);

      expect(response).toEqual(expect.arrayContaining(bookmarks));
    });
  });
});
