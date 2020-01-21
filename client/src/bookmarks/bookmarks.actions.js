import { NotificationManager } from 'react-notifications';
import { getData, sendData, FORM_HEADERS, JSON_HEADERS } from '../utils/http';

export const FETCH_BOOKMARKS_SUCCESS = 'FETCH_BOOKMARKS_SUCCESS';
export const FETCH_BOOKMARKS_FAILURE = 'FETCH_BOOKMARKS_FAILURE';

export const ADD_BOOKMARK_SUCCESS = 'ADD_BOOKMARK_SUCCESS';
export const ADD_BOOKMARK_FAILURE = 'ADD_BOOKMARK_FAILURE';

export const DELETE_BOOKMARK_SUCCESS = 'DELETE_BOOKMARK_SUCCESS';
export const DELETE_BOOKMARK_FAILURE = 'DELETE_BOOKMARK_FAILURE';

export const SELECT_BOOKMARK = 'SELECT_BOOKMARK';

const API = {
  fetch: '/api/bookmarks/',
  add: '/api/bookmarks/',
  delete: '/api/bookmarks/'
};

export const fetchBookmarks = () => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...JSON_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await getData(API.fetch, headers);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(error.message, `Fetching Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: FETCH_BOOKMARKS_FAILURE,
      error
    });
  }

  const bookmarks = await response.json();
  // const bookmarks = [DATA, DATA1];

  return dispatch({ type: FETCH_BOOKMARKS_SUCCESS, bookmarks });
};

export const addBookmark = bookmark => async (dispatch, getState) => {
  const formData = new FormData();
  Object.keys(bookmark).forEach(key => formData.append(key, bookmark[key]));
  // nested JSON should be stringified prior to passing to backend
  formData.set('center', JSON.stringify(bookmark['center']));
  formData.set('feature_collection', JSON.stringify(bookmark['feature_collection']));

  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    ...FORM_HEADERS,
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.add, formData, headers);

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));

    NotificationManager.error(error.message, `Adding Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: ADD_BOOKMARK_FAILURE,
      error
    });
  } else {
    const newBookmark = await response.json();
    NotificationManager.success('Successfully bookmarked map', 'Successful map bookmarking', 5000, () => {});

    return dispatch({
      type: ADD_BOOKMARK_SUCCESS,
      bookmark: newBookmark
    });
  }
};

export const selectBookmark = bookmark => ({ type: SELECT_BOOKMARK, bookmark });

export const deleteBookmark = bookmark => async (dispatch, getState) => {
  const {
    accounts: { userKey }
  } = getState();
  const headers = {
    Authorization: `Token ${userKey}`
  };

  const response = await sendData(API.delete, bookmark.id, headers, 'DELETE');

  if (!response.ok) {
    const errorResponse = await response.json();
    const error = new Error(errorResponseToString(errorResponse));
    NotificationManager.error(error.message, `Deleting Bookmark Error - ${response.statusText}`, 50000, () => {});

    return dispatch({
      type: DELETE_BOOKMARK_FAILURE,
      error
    });
  } else {
    NotificationManager.success('Successfully deleted bookmark', 'Successful bookmark deletion', 5000, () => {});

    return dispatch({
      type: DELETE_BOOKMARK_SUCCESS,
      bookmark
    });
  }
};

const errorResponseToString = response => {
  // Reduce all field errors to a single string representation.
  const errorStr = Object.keys(response).reduce((acc, key) => {
    const fieldErrors = response[key];

    if (Array.isArray(fieldErrors)) {
      // Reduce array of field errors to a single string representation.
      const errors = fieldErrors.reduce((acc, error) => {
        return (acc += error + ' ');
      }, '');
      acc += `${key} - ${errors}\n`;
    } else if (typeof fieldErrors === 'string' || fieldErrors instanceof String) {
      acc += fieldErrors;
    }

    return acc;
  }, '');

  return errorStr;
};
