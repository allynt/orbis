import { createSlice } from '@reduxjs/toolkit';
import { NotificationManager } from 'react-notifications';

import apiClient from 'api-client';

import {
  getData,
  sendData,
  getJsonAuthHeaders,
  getFormAuthHeaders,
} from '../utils/http';

export const STORIES = [
  {
    title: 'History of Hibs',
    subtitle: 'Location of places played',
    theme: 'satellite',
    chapters: [
      {
        id: 'birthplace',
        title: 'The Cowgate',
        image: '',
        description: 'This is where the team started',
        location: {
          center: [-3.1887179999999944, 55.948564000000005],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
        onEnter: [
          {
            id: 'cowgate',
            type: 'vector',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/metadata.json',
          },
          {
            id: 'cowgate-infrastructure',
            type: 'geojson',
            url: 'https://staticdata.testing.or3is.com/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson',
          },
        ],
      },
      {
        id: 'meadows',
        title: 'The Meadows',
        image: '',
        description: 'This is where the team played',
        location: {
          center: [-3.1943694999999934, 55.941046],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
      },
      {
        id: 'easterrd',
        title: 'Easter Road',
        image: '',
        description: 'This is where the team play',
        location: {
          center: [-3.165666500000043, 55.9617145],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
        onEnter: [
          {
            id: 'easterrd',
            type: 'vector',
            url: 'https://staticdata.testing.or3is.com/astrosat/test/stoke-on-trent/v1/metadata.json',
          },
          {
            id: 'easterrd-infrastructure',
            type: 'geojson',
            url: 'https://staticdata.testing.or3is.com/astrosat/core/hospitals-uk/2019-12-17/hospitals_uk.geojson',
          },
        ],
        onLeave: [],
      },
    ],
  },
  {
    title: 'History of Something else',
    subtitle: 'Location of places in story',
    theme: 'light',
    chapters: [
      {
        id: 'place1',
        title: 'Place One',
        image: '',
        description: 'This is Place One Description',
        location: {
          center: [-3.1887179999999944, 55.948564000000005],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
      },
      {
        id: 'place2',
        title: 'Place Two',
        image: '',
        description: 'This is Place Two Description',
        location: {
          center: [-3.1943694999999934, 55.941046],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
      },
      {
        id: 'place3',
        title: 'Place Three',
        image: '',
        description: 'This is Place Three Description',
        location: {
          center: [-3.165666500000043, 55.9617145],
          zoom: 16,
          pitch: 0.0,
          bearing: 0.0,
        },
      },
    ],
  },
];

const API = '/api/stories/';

const initialState = {
  stories: null,
  selectedStory: null,
  error: null,
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    fetchStoriesSuccess: (state, { payload }) => {
      state.stories = payload;
      state.error = null;
    },
    fetchStoriesFailure: (state, { payload }) => {
      state.error = payload;
    },
    addStorySuccess: (state, { payload }) => {
      state.stories = state.stories ? [...state.stories, payload] : [payload];
      state.selectedStory = payload;
      state.error = null;
    },
    addStoryFailure: (state, { payload }) => {
      state.error = payload;
    },
    deleteStorySuccess: (state, { payload }) => {
      const filteredStories = state.stories.filter(
        story => story.id !== payload.id,
      );
      const isSelectedStory =
        state.selectedStory && state.selectedStory.id === payload.id;
      const selectedStory = isSelectedStory ? null : state.selectedStory;

      state.stories = filteredStories;
      state.selectedStory = selectedStory;
      state.error = null;
    },
    deleteStoryFailure: (state, { payload }) => {
      state.error = payload;
    },
    selectStory: (state, { payload }) => {
      state.selectedStory = payload;
    },
  },
});

export const {
  fetchStoriesSuccess,
  fetchStoriesFailure,
  addStorySuccess,
  addStoryFailure,
  deleteStorySuccess,
  deleteStoryFailure,
  selectStory,
} = storiesSlice.actions;

export const fetchStories = () => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await getData(`${apiClient.apiHost}${API}`, headers);

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Fetching Stories Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(fetchStoriesFailure({ message }));
  }

  // const stories = await response.json();
  const stories = STORIES;

  return dispatch(fetchStoriesSuccess(stories));
};

export const addStory = story => async (dispatch, getState) => {
  const formData = new FormData();
  Object.keys(story).forEach(key => formData.append(key, story[key]));

  const headers = getFormAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API}`,
    formData,
    headers,
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Adding Story Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(addStoryFailure({ message }));
  }

  const newStory = await response.json();
  NotificationManager.success(
    'Successfully created a story',
    'Successful story creation',
    5000,
    () => {},
  );

  return dispatch(addStorySuccess(newStory));
};

export const deleteStory = story => async (dispatch, getState) => {
  const headers = getJsonAuthHeaders(getState());

  const response = await sendData(
    `${apiClient.apiHost}${API}`,
    story.id,
    headers,
    'DELETE',
  );

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;

    NotificationManager.error(
      message,
      `Deleting Story Error - ${response.statusText}`,
      50000,
      () => {},
    );

    return dispatch(deleteStoryFailure({ message }));
  }

  NotificationManager.success(
    'Successfully deleted story',
    'Successful story deletion',
    5000,
    () => {},
  );

  return dispatch(deleteStorySuccess(story));
};

export default storiesSlice.reducer;
