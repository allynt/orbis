// import { existsSync, mkdirSync, createWriteStream, unlinkSync } from 'fs';

let bookmarks = [
  {
    id: 1,
    owner: '6e5ac533-0245-4031-ab65-b1eff4d30a1f',
    title: 'Scotland',
    description:
      'This is a description paragraph that describes the contents of this bookmark.',
    created: '2020-01-31T12:01:22.640053Z',
    zoom: 6.61084694352591,
    center: [-5.205274, 57.178733],
    feature_collection: { type: 'FeatureCollection', features: [] },
    thumbnail:
      'https://www.undiscoveredscotland.co.uk/usscotfax/geography/images/geography-450.jpg',
  },
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
    thumbnail: 'https://cdn.mos.cms.futurecdn.net/PuMd7Vw3wsZafT27T2xWtF.jpg',
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

const getBookmarks = () => bookmarks;

const addBookmark = bookmarkData => {
  const fileName = `${bookmarkData.title
    .split(/\s/)
    .join('-')
    .toLowerCase()}.png`;

  const newBookmark = {
    ...bookmarkData,
    id: Date.now(),
    created: new Date().toISOString(),
    center: JSON.parse(bookmarkData.center),
    zoom: +bookmarkData.zoom,
    layers: JSON.parse(bookmarkData.layers),
    thumbnail: `http://localhost:8000/api/bookmarks/media/${bookmarkData.owner}/${fileName}`,
  };
  bookmarks.push(newBookmark);

  return newBookmark;
};

const deleteBookmark = deletionId => {
  const bookmarkToDelete = bookmarks.find(
    bookmark => bookmark.id === deletionId,
  );

  bookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkToDelete.id);
};

export { getBookmarks, addBookmark, deleteBookmark };
