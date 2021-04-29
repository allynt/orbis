import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  fetchAppConfig,
  appConfigSuccess,
  appConfigFailure,
  notYetImplemented,
  mapboxTokenSelector,
  addLogItem,
  removeLogItems,
  logUserTracking,
} from './app.slice';

const mockStore = configureMockStore([thunk]);

describe('App Slice', () => {
  describe('App Actions', () => {
    let store = null;
    const trackingQueue = [
      {
        content: { id: 'Test ID 1' },
        tags: ['tag 1', 'tag 2'],
      },
    ];

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' },
        app: {
          trackingQueue,
        },
      });
    });

    it('should dispatch fetch app config failure action.', async () => {
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
        { type: appConfigFailure.type, payload: { message: '401 Test Error' } },
      ];

      await store.dispatch(fetchAppConfig());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch app config success action.', async () => {
      const config = {
        mapStyles: [
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 4,
          },
        ],
      };

      fetch.mockResponse(JSON.stringify(config));

      const expectedActions = [
        { type: appConfigSuccess.type, payload: config },
      ];

      await store.dispatch(fetchAppConfig());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch logUserTracking action.', async () => {
      fetch.mockResponse(JSON.stringify(trackingQueue));

      const expectedActions = [
        { type: removeLogItems.type, payload: trackingQueue },
      ];

      await store.dispatch(logUserTracking());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('App Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        config: {},
        error: null,
        notYetImplementedDescription: null,
        trackingQueue: [],
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it('should update the app config in state, when successfully retrieved app config', () => {
      const config = { message: 'Test App Config' };

      const actualState = reducer(beforeState, {
        type: appConfigSuccess.type,
        payload: config,
      });

      expect(actualState.config).toEqual(config);
    });

    it('should update the error state, when failed to retrieve app config', () => {
      const error = { message: 'Test App Config Error' };

      const actualState = reducer(beforeState, {
        type: appConfigFailure.type,
        payload: error,
      });

      expect(actualState.error).toEqual(error);
    });

    it('should set the `not yet implemented` message in state', () => {
      const message = 'Test Not Yet Implmented message';

      const actualState = reducer(beforeState, {
        type: notYetImplemented.type,
        payload: message,
      });

      expect(actualState.notYetImplementedDescription).toEqual(message);
    });

    it('should add a log item to state', () => {
      const payload = { content: { id: 'Test id' }, tags: ['tag1', 'tag2'] };

      const actualState = reducer(beforeState, {
        type: addLogItem.type,
        payload,
      });

      expect(actualState.trackingQueue).toEqual([payload]);
    });

    it('should remove a subset of log items fro,=m state', () => {
      const payload = [
        { content: { id: 'Test id 2' }, tags: ['tag3', 'tag4'] },
      ];

      beforeState.trackingQueue = [
        { content: { id: 'Test id 1' }, tags: ['tag1', 'tag2'] },
        payload[0],
      ];

      const actualState = reducer(beforeState, {
        type: removeLogItems.type,
        payload,
      });

      expect(actualState.trackingQueue).toEqual([beforeState.trackingQueue[0]]);
    });
  });

  describe('selectors', () => {
    describe('mapboxTokenSelector', () => {
      it('returns undefined if state is undefined', () => {
        const result = mapboxTokenSelector();
        expect(result).toBeUndefined();
      });

      it('returns undefined if app is undefined', () => {
        const state = {};
        const result = mapboxTokenSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if config is undefined', () => {
        const state = { app: {} };
        const result = mapboxTokenSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns undefined if mapbox_token is undefined', () => {
        const state = { app: { config: {} } };
        const result = mapboxTokenSelector(state);
        expect(result).toBeUndefined();
      });

      it('returns the value of mapbox_token', () => {
        const state = { app: { config: { mapbox_token: '123abc' } } };
        const result = mapboxTokenSelector(state);
        expect(result).toEqual(state.app.config.mapbox_token);
      });
    });
  });
});
