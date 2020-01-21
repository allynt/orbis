import {
  FETCH_BOOKMARKS_SUCCESS,
  FETCH_BOOKMARKS_FAILURE,
  ADD_BOOKMARK_SUCCESS,
  ADD_BOOKMARK_FAILURE,
  DELETE_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_FAILURE,
  SELECT_BOOKMARK
} from './bookmarks.actions';

const data = [
  {
    id: 9,
    owner: 2,
    title: 'Monochrome',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    zoom: 4.21289042692238,
    center: [-92.274898, 23.12388],
    feature_collection: {
      type: 'FeatureCollection',
      features: []
    },
    thumbnail:
      'https://orbis-testing-media.s3.amazonaws.com/bookmarks/rory.macgregor%40astrosat.net/monochrome.png?AWSAccessKeyId=AKIAIJ52PIL3CQE4SYWA&Signature=ydy4pIY3tfNvQp9fuoURVaN8oK8%3D&Expires=1579612063'
  },
  {
    id: 8,
    owner: 2,
    title: 'Street',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    zoom: 7.39030804552284,
    center: [-5.572068, 56.426104],
    feature_collection: {
      type: 'FeatureCollection',
      features: []
    },
    thumbnail:
      'https://orbis-testing-media.s3.amazonaws.com/bookmarks/rory.macgregor%40astrosat.net/street.png?AWSAccessKeyId=AKIAIJ52PIL3CQE4SYWA&Signature=osshEh3rZCesG2S13fnoqf%2FsA30%3D&Expires=1579612063'
  },
  {
    id: 7,
    owner: 2,
    title: 'Map 2',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    zoom: 7.39030804552284,
    center: [-5.572068, 56.426104],
    feature_collection: {
      type: 'FeatureCollection',
      features: []
    },
    thumbnail:
      'https://orbis-testing-media.s3.amazonaws.com/bookmarks/rory.macgregor%40astrosat.net/map-2.png?AWSAccessKeyId=AKIAIJ52PIL3CQE4SYWA&Signature=4c3uM1uKWalh%2BLaPGtq448VK5rE%3D&Expires=1579612063'
  },
  {
    id: 6,
    owner: 2,
    title: 'West Scotland',
    description: 'This is a description paragraph that describes the contents of this bookmark.',
    zoom: 7.39030804552284,
    center: [-5.362513, 56.479374],
    feature_collection: {
      type: 'FeatureCollection',
      features: []
    },
    thumbnail:
      'https://orbis-testing-media.s3.amazonaws.com/bookmarks/rory.macgregor%40astrosat.net/west-scotland.png?AWSAccessKeyId=AKIAIJ52PIL3CQE4SYWA&Signature=hzV8vaqTOQEar0Qw3OS45RvYfkg%3D&Expires=1579612063'
  }
];

const initialState = {
  bookmarks: data,
  selectedBookmark: null,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: action.bookmarks,
        error: null
      };

    case FETCH_BOOKMARKS_FAILURE:
      return { ...state, error: action.error };

    case ADD_BOOKMARK_SUCCESS:
      const bookmarks = [...state.bookmarks, action.bookmark];
      return {
        ...state,
        bookmarks,
        selectedBookmark: action.bookmark,
        error: null
      };

    case ADD_BOOKMARK_FAILURE:
      return { ...state, error: action.error };

    case DELETE_BOOKMARK_SUCCESS:
      const filteredBookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.bookmark.id);
      const isSelectedBookmark = state.selectedBookmark && state.selectedBookmark.id === action.bookmark.id;
      const selectedBookmark = isSelectedBookmark ? null : state.selectedBookmark;
      return {
        ...state,
        bookmarks: filteredBookmarks,
        selectedBookmark: selectedBookmark,
        error: null
      };

    case DELETE_BOOKMARK_FAILURE:
      return { ...state, error: action.error };

    case SELECT_BOOKMARK:
      return { ...state, selectedBookmark: action.bookmark };

    default:
      return state;
  }
};

export default reducer;
