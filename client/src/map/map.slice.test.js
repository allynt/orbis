import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { regions } from './map.constants';

import reducer, {
  setViewport,
  selectMapStyle,
  toggleCompareMode,
  fetchSourcesSuccess,
  fetchSourcesFailure,
  fetchSources,
  saveMap
} from './map.slice';

const mockStore = configureMockStore([thunk]);

describe('Map Slice', () => {
  describe('Map Actions', () => {
    let store = null;

    beforeEach(() => {
      fetch.resetMocks();

      store = mockStore({
        accounts: { userKey: 'Test-User-Key' }
      });
    });

    it('should dispatch fetch sources failure action.', async () => {
      fetch.mockResponse(
        JSON.stringify({
          message: 'Test error message'
        }),
        {
          ok: false,
          status: 401,
          statusText: 'Test Error'
        }
      );

      const expectedActions = [{ type: fetchSourcesFailure.type, payload: { message: '401 Test Error' } }];

      await store.dispatch(fetchSources());

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch fetch sources success action.', async () => {
      const data = {
        token: 'Test Token',
        timeout: 60,
        sources: [
          {
            id: 1,
            metadata: {
              domain: 'Test Domain 1'
            }
          },
          {
            id: 2,
            metadata: {
              domains: 'Test Domain 2'
            }
          }
        ]
      };
      const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

      fetch.mockResponse(JSON.stringify(data));

      const expectedActions = [{ type: fetchSourcesSuccess.type, payload: { domains, ...data } }];

      await store.dispatch(fetchSources());

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Map Reducer', () => {
    let beforeState;

    beforeEach(() => {
      beforeState = {
        viewport: { zoom: 6, center: [-4.84, 54.71] },
        mapStyles: [],
        selectedMapStyle: {},
        isCompareMode: false,
        domains: [],
        regions,
        pollingPeriod: 30000,
        dataToken: null,
        dataSources: null,
        saveMap: false,
        dimensions: {
          width: -1,
          height: -1
        }
      };
    });

    it('should return the initial state', () => {
      const actualState = reducer(undefined, {});

      expect(actualState).toEqual(beforeState);
    });

    it("'should not update the viewport in state, when value doesn't exist", () => {
      const viewport = {
        center: [-4.84, 54.71],
        zoom: 6
      };
      const actualState = reducer(beforeState, {
        type: setViewport.type,
        payload: null
      });

      expect(actualState.viewport).toEqual(viewport);
    });

    it('should update the viewport in state, when value exists', () => {
      const viewport = {
        center: { lng: -4.84, lat: 54.71 },
        zoom: 5
      };
      const actualState = reducer(beforeState, {
        type: setViewport.type,
        payload: viewport
      });

      expect(actualState.viewport).toEqual(viewport);
    });

    it('should update the map style in state, when set', () => {
      const mapStyles = [
        {
          name: 'light',
          label: 'Light'
        },
        {
          name: 'light',
          label: 'Light'
        }
      ];
      const actualState = reducer(beforeState, {
        type: selectMapStyle.type,
        payload: mapStyles[1]
      });

      expect(actualState.selectedMapStyle).toEqual(mapStyles[1]);
    });

    it('should update the compare map state, when in comparison mode', () => {
      const actualState = reducer(beforeState, {
        type: toggleCompareMode.type
      });

      expect(actualState.isCompareMode).toEqual(!beforeState.isCompareMode);
    });

    it('should update the sources in state, when successfully retrieved', () => {
      const data = {
        token: 'Test Token',
        timeout: 60,
        sources: [
          {
            id: 1,
            metadata: {
              domain: 'Test Domain 1'
            }
          },
          {
            id: 2,
            metadata: {
              domain: 'Test Domain 2'
            }
          }
        ]
      };
      const timeoutInMilliseconds = (data.timeout * 60 * 1000) / 2;
      const domains = Array.from(new Set(data.sources.map(source => source.metadata.domain)));

      const actualState = reducer(beforeState, {
        type: fetchSourcesSuccess.type,
        payload: { ...data, domains }
      });

      expect(actualState.dataToken).toEqual(data.token);
      expect(actualState.pollingPeriod).toEqual(timeoutInMilliseconds);
      expect(actualState.dataSources).toEqual(data.sources);
      expect(actualState.domains).toEqual(domains);
    });

    it('should update the error state, when failed to retrieve sources', () => {
      const error = { message: 'Test Bookmarks Error' };

      const actualState = reducer(beforeState, {
        type: fetchSourcesFailure.type,
        payload: error
      });

      expect(actualState.error).toEqual(error);
    });

    it('should update the saved map in state, when successfully called', () => {
      const actualState = reducer(beforeState, {
        type: saveMap.type
      });

      expect(actualState.saveMap).toEqual(true);
    });
  });
});
