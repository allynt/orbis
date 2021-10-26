import fetch from 'jest-fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchStoriesSuccess,
  fetchStoriesFailure,
  fetchStories,
  addStorySuccess,
  addStoryFailure,
  addStory,
  deleteStorySuccess,
  deleteStoryFailure,
  deleteStory,
  selectStory,
  STORIES,
} from './stories.slice';

fetch.enableMocks();

const mockStore = configureMockStore([thunk]);

describe('Stories Slice', () => {
  describe('Stories Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' },
      });
    });

    it('should dispatch fetch stories failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        {
          type: fetchStoriesFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      await store.dispatch(fetchStories());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch stories success action.', async () => {
      fetch.mockResponse(JSON.stringify(STORIES));

      const expectedActions = [
        { type: fetchStoriesSuccess.type, payload: STORIES },
      ];

      await store.dispatch(fetchStories());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch add story failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        { type: addStoryFailure.type, payload: { message: '401 Test Error' } },
      ];

      const story = {
        id: 5,
      };
      await store.dispatch(addStory(story));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch add story success action.', async () => {
      const story = {
        id: 5,
      };
      fetch.mockResponse(JSON.stringify(story));

      const expectedActions = [{ type: addStorySuccess.type, payload: story }];

      await store.dispatch(addStory(story));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete story failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message',
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error',
        },
      );

      const expectedActions = [
        {
          type: deleteStoryFailure.type,
          payload: { message: '401 Test Error' },
        },
      ];

      await store.dispatch(deleteStory(STORIES[1]));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch delete story success action.', async () => {
      fetch.mockResponse(JSON.stringify(STORIES[1]));

      const expectedActions = [
        { type: deleteStorySuccess.type, payload: STORIES[1] },
      ];

      await store.dispatch(deleteStory(STORIES[1]));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch select story action.', async () => {
      const expectedActions = [{ type: selectStory.type, payload: STORIES[2] }];

      await store.dispatch(selectStory(STORIES[2]));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Stories Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        stories: null,
        selectedStory: null,
        error: null,
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the stories in state, when successfully retrieved', () => {
      const actualState = reducer(beforeState, {
        type: fetchStoriesSuccess.type,
        payload: STORIES,
      });

      expect(actualState.stories).toEqual(STORIES);
    });

    it('should update the error state, when failed to retrieve stories', () => {
      const error = { message: 'Test Stories Error' };

      const actualState = reducer(beforeState, {
        type: fetchStoriesFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the stories in state, when successfully added a new story', () => {
      const story = { id: 5 };

      const actualState = reducer(beforeState, {
        type: addStorySuccess.type,
        payload: story,
      });

      expect(actualState.stories).toEqual([story]);
    });

    it('should update the error state, when failed to add a new story', () => {
      const error = { message: 'Test Stories Error' };

      const actualState = reducer(beforeState, {
        type: addStoryFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the stories in state, when successfully deleted a story', () => {
      const story = { ...STORIES[1] };
      beforeState.stories = STORIES;

      const actualState = reducer(beforeState, {
        type: deleteStorySuccess.type,
        payload: story,
      });

      expect(actualState.stories).toEqual(
        beforeState.stories.filter(stateStory => stateStory.id !== story.id),
      );
    });

    it('should update the error state, when failed to delete a story', () => {
      const error = { message: 'Test Stories Error' };

      const actualState = reducer(beforeState, {
        type: deleteStoryFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the selected story in state, when one selected', () => {
      const story = { ...STORIES[1] };
      beforeState.stories = STORIES;

      const actualState = reducer(beforeState, {
        type: selectStory.type,
        payload: story,
      });

      expect(actualState.selectedStory).toEqual(story);
    });
  });
});
